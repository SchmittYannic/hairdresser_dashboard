package com.example.backend.appointment.repository;

import com.example.backend.appointment.dto.Appointment;
import com.mongodb.BasicDBObject;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Repository
public class AppointmentRepository {
    @Autowired
    private MongoTemplate mongoTemplate;

    public Map<String, List<Appointment>> getGroupedAppointments(
            String employeeId,
            List<LocalDate> specificDates,
            LocalDate start,
            LocalDate end
    ) {
        List<AggregationOperation> pipeline = new ArrayList<>();

        Criteria criteria = new Criteria();
        if (employeeId != null && !employeeId.isEmpty()) {
            try {
                criteria = Criteria.where("employee").is(new ObjectId(employeeId));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid employeeId format: " + employeeId, e);
            }
        }

        System.out.println("Criteria: " + criteria.getCriteriaObject());

        if (specificDates != null && !specificDates.isEmpty()) {
            List<Date> fromDates = specificDates.stream()
                    .map(date -> Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()))
                    .toList();

            List<Date> toDates = specificDates.stream()
                    .map(date -> Date.from(date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()))
                    .toList();

            criteria = criteria.and("start").gte(Collections.min(fromDates)).lt(Collections.max(toDates));
        } else if (start != null && end != null) {
            Date startDate = Date.from(start.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDate = Date.from(end.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

            criteria = criteria.and("start").gte(startDate).lt(endDate);
        }

        pipeline.add(Aggregation.match(criteria));

        pipeline.add(
                Aggregation.project("employee", "customer", "service_name", "duration", "start", "end", "remarks", "createdAt", "updatedAt")
                        .andExpression("dateToString('%Y-%m-%d', start)").as("dateGroup")
        );

        pipeline.add(Aggregation.group("dateGroup").push("$$ROOT").as("appointments"));
        pipeline.add(Aggregation.sort(Sort.by(Sort.Direction.ASC, "_id")));

        Aggregation aggregation = Aggregation.newAggregation(pipeline);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "appointments", Document.class);

        System.out.println("Aggregation Pipeline: " + aggregation.toString());

        Map<String, List<Appointment>> grouped = new LinkedHashMap<>();
        for (Document obj : results) {
            String date = obj.getString("_id");
            List<Appointment> items = ((List<?>) obj.get("appointments")).stream()
                    .map(o -> mongoTemplate.getConverter().read(Appointment.class, (Document) o))
                    .toList();
            grouped.put(date, items);
        }

        return grouped;
    }
}
