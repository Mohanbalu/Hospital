package com.hms.service;

import java.util.List;

import com.hms.dto.PrescriptionRequestDTO;
import com.hms.dto.PrescriptionResponseDTO;

public interface PrescriptionService {

    PrescriptionResponseDTO addPrescription(PrescriptionRequestDTO request);

    List<PrescriptionResponseDTO> getPrescriptionsByPatient(Long patientId);

    PrescriptionResponseDTO getPrescriptionByAppointment(Long appointmentId);
}
