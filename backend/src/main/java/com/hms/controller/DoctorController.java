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
import com.hms.dto.DoctorRequestDTO;
import com.hms.dto.DoctorResponseDTO;
import com.hms.service.DoctorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctor", description = "Endpoints for doctor management")
@Validated
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create doctor record", description = "Add a new doctor to the system")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> createDoctor(
            @Valid @RequestBody DoctorRequestDTO request) {
        DoctorResponseDTO response = doctorService.createDoctor(request);
        return ResponseEntity.ok(ApiResponse.<DoctorResponseDTO>builder()
                .success(true)
                .message("Doctor created successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update doctor", description = "Update a doctor's profile by id")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequestDTO request) {
        DoctorResponseDTO response = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.<DoctorResponseDTO>builder()
                .success(true)
                .message("Doctor updated successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete doctor", description = "Remove a doctor from the system by id")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Doctor deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    @Operation(summary = "List doctors", description = "Retrieve all doctors")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAllDoctors() {
        List<DoctorResponseDTO> response = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.<List<DoctorResponseDTO>>builder()
                .success(true)
                .message("Doctors retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    @Operation(summary = "Get doctor details", description = "Fetch doctor details by id")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> getDoctorById(@PathVariable Long id) {
        DoctorResponseDTO response = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.<DoctorResponseDTO>builder()
                .success(true)
                .message("Doctor retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/specialization")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    @Operation(summary = "Search doctors by specialization", description = "Find doctors by specialization")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getDoctorsBySpecialization(
            @RequestParam("specialization") String specialization) {
        List<DoctorResponseDTO> response = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.<List<DoctorResponseDTO>>builder()
                .success(true)
                .message("Doctors filtered by specialization successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }
}
