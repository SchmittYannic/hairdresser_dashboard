package com.example.backend.appointment.controller;

import com.example.backend.appointment.dto.Appointment;
import com.example.backend.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Appointment>>> getGroupedAppointments(
            @RequestParam String employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) List<LocalDate> dates,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        System.out.println("EMPLOYEE: " + employeeId);
        System.out.println("DATES: " + dates);
        System.out.println("START: " + start + " - END: " + end);
        Map<String, List<Appointment>> grouped = appointmentRepository.getGroupedAppointments(
                employeeId, dates, start, end
        );
        return ResponseEntity.ok(grouped);
    }
}
