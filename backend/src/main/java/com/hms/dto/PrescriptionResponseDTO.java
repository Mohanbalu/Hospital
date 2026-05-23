package com.hms.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponseDTO {

    private Long id;
    private Long appointmentId;
    private LocalDateTime appointmentDateTime;
    private Long patientId;
    private Long doctorId;
    private String diagnosis;
    private String medication;
    private String dosage;
    private String instructions;
    private LocalDateTime prescribedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
