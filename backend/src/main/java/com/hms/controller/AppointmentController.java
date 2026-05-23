package com.hms.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.ApiResponse;
import com.hms.dto.AppointmentRequestDTO;
import com.hms.dto.AppointmentResponseDTO;
import com.hms.service.AppointmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointment", description = "Endpoints for appointment scheduling")
@Validated
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "Book appointment", description = "Create a new appointment")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(
            @Valid @RequestBody AppointmentRequestDTO request) {
        AppointmentResponseDTO response = appointmentService.bookAppointment(request);
        return ResponseEntity.ok(ApiResponse.<AppointmentResponseDTO>builder()
                .success(true)
                .message("Appointment booked successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @PutMapping("/reschedule/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    @Operation(summary = "Reschedule appointment", description = "Update appointment date and details")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> rescheduleAppointment(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentRequestDTO request) {
        AppointmentResponseDTO response = appointmentService.rescheduleAppointment(id, request);
        return ResponseEntity.ok(ApiResponse.<AppointmentResponseDTO>builder()
                .success(true)
                .message("Appointment rescheduled successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    @Operation(summary = "Cancel appointment", description = "Cancel an existing appointment")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> cancelAppointment(@PathVariable Long id) {
        AppointmentResponseDTO response = appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(ApiResponse.<AppointmentResponseDTO>builder()
                .success(true)
                .message("Appointment cancelled successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    @Operation(summary = "List appointments", description = "Retrieve all appointment history")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAllAppointments() {
        List<AppointmentResponseDTO> response = appointmentService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.<List<AppointmentResponseDTO>>builder()
                .success(true)
                .message("Appointments retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR','PATIENT')")
    @Operation(summary = "Get appointment", description = "Retrieve appointment details by id")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> getAppointmentById(@PathVariable Long id) {
        AppointmentResponseDTO response = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.<AppointmentResponseDTO>builder()
                .success(true)
                .message("Appointment retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }
}
