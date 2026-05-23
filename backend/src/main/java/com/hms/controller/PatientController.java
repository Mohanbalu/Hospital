package com.hms.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.ApiResponse;
import com.hms.dto.PatientRequestDTO;
import com.hms.dto.PatientResponseDTO;
import com.hms.service.PatientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patient", description = "Endpoints for patient management")
@Validated
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "Register a patient", description = "Create a new patient record")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> createPatient(
            @Valid @RequestBody PatientRequestDTO request) {
        PatientResponseDTO response = patientService.createPatient(request);
        return ResponseEntity.ok(ApiResponse.<PatientResponseDTO>builder()
                .success(true)
                .message("Patient created successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "Update patient details", description = "Update patient details by id")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequestDTO request) {
        PatientResponseDTO response = patientService.updatePatient(id, request);
        return ResponseEntity.ok(ApiResponse.<PatientResponseDTO>builder()
                .success(true)
                .message("Patient updated successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove a patient", description = "Delete a patient record by id")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Patient deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','PATIENT')")
    @Operation(summary = "Get patient details", description = "Retrieve a patient by id")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> getPatientById(@PathVariable Long id) {
        PatientResponseDTO response = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.<PatientResponseDTO>builder()
                .success(true)
                .message("Patient retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "List all patients", description = "Retrieve all registered patients")
    public ResponseEntity<ApiResponse<List<PatientResponseDTO>>> getAllPatients() {
        List<PatientResponseDTO> response = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.<List<PatientResponseDTO>>builder()
                .success(true)
                .message("Patients retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "Search patients", description = "Search patients by first or last name")
    public ResponseEntity<ApiResponse<List<PatientResponseDTO>>> searchPatients(
            @RequestParam("name") String name) {
        List<PatientResponseDTO> response = patientService.searchPatientsByName(name);
        return ResponseEntity.ok(ApiResponse.<List<PatientResponseDTO>>builder()
                .success(true)
                .message("Patient search completed successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }
}
