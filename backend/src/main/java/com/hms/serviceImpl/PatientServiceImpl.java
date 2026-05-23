package com.hms.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.PatientRequestDTO;
import com.hms.dto.PatientResponseDTO;
import com.hms.entity.Patient;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.PatientRepository;
import com.hms.service.PatientService;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public PatientResponseDTO createPatient(PatientRequestDTO request) {
        log.info("Creating new patient: {} {}", request.getFirstName(), request.getLastName());
        Patient patient = Patient.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .gender(request.getGender().trim())
                .dateOfBirth(request.getDateOfBirth())
                .email(request.getEmail().trim().toLowerCase())
                .phoneNumber(request.getPhoneNumber().trim())
                .address(request.getAddress().trim())
                .bloodGroup(request.getBloodGroup())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .build();
        return mapToPatientResponse(patientRepository.save(patient));
    }

    @Override
    @Transactional
    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO request) {
        log.info("Updating patient with id {}", id);
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patient.setFirstName(request.getFirstName().trim());
        patient.setLastName(request.getLastName().trim());
        patient.setGender(request.getGender().trim());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setEmail(request.getEmail().trim().toLowerCase());
        patient.setPhoneNumber(request.getPhoneNumber().trim());
        patient.setAddress(request.getAddress().trim());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        return mapToPatientResponse(patientRepository.save(patient));
    }

    @Override
    @Transactional
    public void deletePatient(Long id) {
        log.info("Deleting patient with id {}", id);
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    @Override
    public PatientResponseDTO getPatientById(Long id) {
        log.info("Fetching patient with id {}", id);
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToPatientResponse(patient);
    }

    @Override
    public List<PatientResponseDTO> getAllPatients() {
        log.info("Fetching all patients");
        return patientRepository.findAll().stream()
                .map(this::mapToPatientResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PatientResponseDTO> searchPatientsByName(String name) {
        if (name == null || name.isBlank()) {
            throw new ValidationException("Search name must not be blank");
        }
        log.info("Searching patients by name: {}", name);
        String searchTerm = name.trim().toLowerCase();
        return patientRepository.findAll().stream()
                .filter(patient -> patient.getFirstName().toLowerCase().contains(searchTerm)
                        || patient.getLastName().toLowerCase().contains(searchTerm))
                .map(this::mapToPatientResponse)
                .collect(Collectors.toList());
    }

    private PatientResponseDTO mapToPatientResponse(Patient patient) {
        return PatientResponseDTO.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .gender(patient.getGender())
                .dateOfBirth(patient.getDateOfBirth())
                .email(patient.getEmail())
                .phoneNumber(patient.getPhoneNumber())
                .address(patient.getAddress())
                .bloodGroup(patient.getBloodGroup())
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactPhone(patient.getEmergencyContactPhone())
                .createdAt(patient.getCreatedAt())
                .updatedAt(patient.getUpdatedAt())
                .build();
    }
}
