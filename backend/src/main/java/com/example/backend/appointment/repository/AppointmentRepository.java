package com.example.backend.appointment.repository;

import com.example.backend.appointment.dto.ScheduleAppointmentDTO;
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

    public Map<String, List<ScheduleAppointmentDTO>> getGroupedAppointments(
            String employeeId,
            List<LocalDate> dates,
            LocalDate start,
            LocalDate end
    ) {
        List<AggregationOperation> pipeline = new ArrayList<>();

        Criteria criteria;

        if (dates != null && !dates.isEmpty()) {
            List<Criteria> dateCriteria = new ArrayList<>();
            for (LocalDate date : dates) {
                Date from = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date to = Date.from(date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
                dateCriteria.add(Criteria.where("start").gte(from).lt(to));
            }

            criteria = new Criteria().andOperator(
                    Criteria.where("employee").is(new ObjectId(employeeId)),
                    new Criteria().orOperator(dateCriteria.toArray(new Criteria[0]))
            );
        } else if (start != null && end != null) {
            Date startDate = Date.from(start.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDate = Date.from(end.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            criteria = new Criteria().andOperator(
                    Criteria.where("employee").is(new ObjectId(employeeId)),
                    Criteria.where("start").gte(startDate).lt(endDate)
            );
        } else {
            criteria = Criteria.where("employee").is(new ObjectId(employeeId));
        }

        pipeline.add(Aggregation.match(criteria));

        pipeline.add(
                Aggregation.lookup("users", "customer", "_id", "customerData")
        );

        pipeline.add(
                Aggregation.unwind("customerData", true) // true = preserve null/empty
        );

        pipeline.add(
                Aggregation.project("employee", "customer", "service_name", "duration", "start", "end")
                        .and("customerData.firstname").as("customerFirstname")
                        .and("customerData.lastname").as("customerLastname")
                        .andExpression("dateToString('%Y-%m-%d', start)").as("dateGroup")
        );

        pipeline.add(Aggregation.group("dateGroup").push("$$ROOT").as("appointments"));
        pipeline.add(Aggregation.sort(Sort.by(Sort.Direction.ASC, "_id")));

        Aggregation aggregation = Aggregation.newAggregation(pipeline);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "appointments", Document.class);

        Map<String, List<ScheduleAppointmentDTO>> grouped = new LinkedHashMap<>();
        for (Document obj : results) {
            String date = obj.getString("_id");
            List<ScheduleAppointmentDTO> items = ((List<?>) obj.get("appointments")).stream()
                    .map(o -> mongoTemplate.getConverter().read(ScheduleAppointmentDTO.class, (Document) o))
                    .toList();
            grouped.put(date, items);
        }

        return grouped;
    }
}
