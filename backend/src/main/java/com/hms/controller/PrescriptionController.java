package com.hms.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.ApiResponse;
import com.hms.dto.PrescriptionRequestDTO;
import com.hms.dto.PrescriptionResponseDTO;
import com.hms.service.PrescriptionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prescriptions")
@Tag(name = "Prescription", description = "Endpoints for prescription management")
@Validated
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @Operation(summary = "Create prescription", description = "Add a prescription for an appointment")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> addPrescription(
            @Valid @RequestBody PrescriptionRequestDTO request) {
        PrescriptionResponseDTO response = prescriptionService.addPrescription(request);
        return ResponseEntity.ok(ApiResponse.<PrescriptionResponseDTO>builder()
                .success(true)
                .message("Prescription created successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PATIENT')")
    @Operation(summary = "Get patient prescriptions", description = "Retrieve prescriptions for a patient")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPrescriptionsByPatient(
            @PathVariable Long patientId) {
        List<PrescriptionResponseDTO> response = prescriptionService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.<List<PrescriptionResponseDTO>>builder()
                .success(true)
                .message("Prescriptions retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @Operation(summary = "Get prescription by appointment", description = "Retrieve a prescription by appointment id")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionByAppointment(
            @PathVariable Long appointmentId) {
        PrescriptionResponseDTO response = prescriptionService.getPrescriptionByAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.<PrescriptionResponseDTO>builder()
                .success(true)
                .message("Prescription retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }
}
