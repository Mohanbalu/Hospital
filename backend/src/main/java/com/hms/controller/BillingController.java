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
import com.hms.dto.BillRequestDTO;
import com.hms.dto.BillResponseDTO;
import com.hms.service.BillingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bills")
@Tag(name = "Billing", description = "Endpoints for billing and payment management")
@Validated
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "Create bill", description = "Generate a new bill for a patient or appointment")
    public ResponseEntity<ApiResponse<BillResponseDTO>> generateBill(
            @Valid @RequestBody BillRequestDTO request) {
        BillResponseDTO response = billingService.generateBill(request);
        return ResponseEntity.ok(ApiResponse.<BillResponseDTO>builder()
                .success(true)
                .message("Bill generated successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @PutMapping("/payment/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "Update bill payment status", description = "Update the payment status for an existing bill")
    public ResponseEntity<ApiResponse<BillResponseDTO>> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody BillRequestDTO request) {
        BillResponseDTO response = billingService.updatePaymentStatus(id, request);
        return ResponseEntity.ok(ApiResponse.<BillResponseDTO>builder()
                .success(true)
                .message("Bill payment status updated successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','PATIENT')")
    @Operation(summary = "Get bill details", description = "Retrieve a bill by id")
    public ResponseEntity<ApiResponse<BillResponseDTO>> getBillById(@PathVariable Long id) {
        BillResponseDTO response = billingService.getBillById(id);
        return ResponseEntity.ok(ApiResponse.<BillResponseDTO>builder()
                .success(true)
                .message("Bill retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @Operation(summary = "List all bills", description = "Retrieve all generated bills")
    public ResponseEntity<ApiResponse<List<BillResponseDTO>>> getAllBills() {
        List<BillResponseDTO> response = billingService.getAllBills();
        return ResponseEntity.ok(ApiResponse.<List<BillResponseDTO>>builder()
                .success(true)
                .message("Bills retrieved successfully")
                .timestamp(LocalDateTime.now())
                .data(response)
                .build());
    }
}
