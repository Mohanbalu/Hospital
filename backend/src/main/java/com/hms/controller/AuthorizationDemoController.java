package com.hms.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.ApiResponse;

@RestController
@RequestMapping("/api/access")
public class AuthorizationDemoController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> adminAccess() {
        return ResponseEntity.ok(buildResponse("ADMIN access granted"));
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<String>> doctorAccess() {
        return ResponseEntity.ok(buildResponse("DOCTOR access granted"));
    }

    @GetMapping("/patient")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<String>> patientAccess() {
        return ResponseEntity.ok(buildResponse("PATIENT access granted"));
    }

    @GetMapping("/receptionist")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<String>> receptionistAccess() {
        return ResponseEntity.ok(buildResponse("RECEPTIONIST access granted"));
    }

    private ApiResponse<String> buildResponse(String message) {
        return ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .data(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
