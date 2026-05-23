package com.hms.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.PrescriptionRequestDTO;
import com.hms.dto.PrescriptionResponseDTO;
import com.hms.entity.Appointment;
import com.hms.entity.Prescription;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.service.PrescriptionService;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public PrescriptionResponseDTO addPrescription(PrescriptionRequestDTO request) {
        log.info("Adding prescription for appointment {}", request.getAppointmentId());
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + request.getAppointmentId()));
        if (appointment.getPrescription() != null) {
            throw new ValidationException("Prescription already exists for appointment id: " + request.getAppointmentId());
        }
        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .diagnosis(request.getDiagnosis().trim())
                .medication(request.getMedication().trim())
                .dosage(request.getDosage().trim())
                .instructions(request.getInstructions())
                .prescribedAt(java.time.LocalDateTime.now())
                .build();
        return mapToPrescriptionResponse(prescriptionRepository.save(prescription));
    }

    @Override
    public List<PrescriptionResponseDTO> getPrescriptionsByPatient(Long patientId) {
        if (patientId == null) {
            throw new ValidationException("Patient id is required");
        }
        log.info("Fetching prescriptions for patient {}", patientId);
        return prescriptionRepository.findAll().stream()
                .filter(prescription -> prescription.getAppointment().getPatient().getId().equals(patientId))
                .map(this::mapToPrescriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PrescriptionResponseDTO getPrescriptionByAppointment(Long appointmentId) {
        if (appointmentId == null) {
            throw new ValidationException("Appointment id is required");
        }
        log.info("Fetching prescription for appointment {}", appointmentId);
        return prescriptionRepository.findAll().stream()
                .filter(prescription -> prescription.getAppointment().getId().equals(appointmentId))
                .findFirst()
                .map(this::mapToPrescriptionResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found for appointment id: " + appointmentId));
    }

    private PrescriptionResponseDTO mapToPrescriptionResponse(Prescription prescription) {
        return PrescriptionResponseDTO.builder()
                .id(prescription.getId())
                .appointmentId(prescription.getAppointment().getId())
                .appointmentDateTime(prescription.getAppointment().getAppointmentDateTime())
                .patientId(prescription.getAppointment().getPatient().getId())
                .doctorId(prescription.getAppointment().getDoctor().getId())
                .diagnosis(prescription.getDiagnosis())
                .medication(prescription.getMedication())
                .dosage(prescription.getDosage())
                .instructions(prescription.getInstructions())
                .prescribedAt(prescription.getPrescribedAt())
                .createdAt(prescription.getCreatedAt())
                .updatedAt(prescription.getUpdatedAt())
                .build();
    }
}
