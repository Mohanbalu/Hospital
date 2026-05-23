package com.hms.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDTO {

    private Long id;
    private Long departmentId;
    private String departmentName;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String licenseNumber;
    private String specialization;
    private Integer yearsOfExperience;
    private BigDecimal consultationFee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
