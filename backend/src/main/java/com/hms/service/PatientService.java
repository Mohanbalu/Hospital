package com.hms.service;

import java.util.List;

import com.hms.dto.PatientRequestDTO;
import com.hms.dto.PatientResponseDTO;

public interface PatientService {

    PatientResponseDTO createPatient(PatientRequestDTO request);

    PatientResponseDTO updatePatient(Long id, PatientRequestDTO request);

    void deletePatient(Long id);

    PatientResponseDTO getPatientById(Long id);

    List<PatientResponseDTO> getAllPatients();

    List<PatientResponseDTO> searchPatientsByName(String name);
}
