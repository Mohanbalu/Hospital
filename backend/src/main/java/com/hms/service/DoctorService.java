package com.hms.service;

import java.util.List;

import com.hms.dto.DoctorRequestDTO;
import com.hms.dto.DoctorResponseDTO;

public interface DoctorService {

    DoctorResponseDTO createDoctor(DoctorRequestDTO request);

    DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO request);

    void deleteDoctor(Long id);

    DoctorResponseDTO getDoctorById(Long id);

    List<DoctorResponseDTO> getAllDoctors();

    List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization);
}
