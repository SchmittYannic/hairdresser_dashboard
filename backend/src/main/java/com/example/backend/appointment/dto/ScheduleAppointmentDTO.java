package com.example.backend.appointment.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Date;

@Data
@Builder
public class ScheduleAppointmentDTO {
    private String id;

    private String employee;
    private String customer;
    private String customerFirstname;
    private String customerLastname;

    @Field("service_name")
    private String serviceName;

    private Integer duration;
    private Date start;
    private Date end;
}