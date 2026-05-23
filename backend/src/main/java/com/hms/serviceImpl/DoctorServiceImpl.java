package com.hms.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.DoctorRequestDTO;
import com.hms.dto.DoctorResponseDTO;
import com.hms.entity.Department;
import com.hms.entity.Doctor;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.DepartmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.service.DoctorService;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public DoctorResponseDTO createDoctor(DoctorRequestDTO request) {
        log.info("Creating new doctor: {} {}", request.getFirstName(), request.getLastName());
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
        Doctor doctor = Doctor.builder()
                .department(department)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phoneNumber(request.getPhoneNumber().trim())
                .licenseNumber(request.getLicenseNumber().trim())
                .specialization(request.getSpecialization().trim())
                .yearsOfExperience(request.getYearsOfExperience())
                .consultationFee(request.getConsultationFee())
                .build();
        return mapToDoctorResponse(doctorRepository.save(doctor));
    }

    @Override
    @Transactional
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO request) {
        log.info("Updating doctor with id {}", id);
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
        doctor.setDepartment(department);
        doctor.setFirstName(request.getFirstName().trim());
        doctor.setLastName(request.getLastName().trim());
        doctor.setEmail(request.getEmail().trim().toLowerCase());
        doctor.setPhoneNumber(request.getPhoneNumber().trim());
        doctor.setLicenseNumber(request.getLicenseNumber().trim());
        doctor.setSpecialization(request.getSpecialization().trim());
        doctor.setYearsOfExperience(request.getYearsOfExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        return mapToDoctorResponse(doctorRepository.save(doctor));
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        log.info("Deleting doctor with id {}", id);
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }

    @Override
    public DoctorResponseDTO getDoctorById(Long id) {
        log.info("Fetching doctor with id {}", id);
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToDoctorResponse(doctor);
    }

    @Override
    public List<DoctorResponseDTO> getAllDoctors() {
        log.info("Fetching all doctors");
        return doctorRepository.findAll().stream()
                .map(this::mapToDoctorResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization) {
        if (specialization == null || specialization.isBlank()) {
            throw new ValidationException("Specialization must not be blank");
        }
        log.info("Searching doctors by specialization: {}", specialization);
        String searchTerm = specialization.trim().toLowerCase();
        return doctorRepository.findAll().stream()
                .filter(doctor -> doctor.getSpecialization().toLowerCase().contains(searchTerm))
                .map(this::mapToDoctorResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponseDTO mapToDoctorResponse(Doctor doctor) {
        return DoctorResponseDTO.builder()
                .id(doctor.getId())
                .departmentId(doctor.getDepartment().getId())
                .departmentName(doctor.getDepartment().getName())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .phoneNumber(doctor.getPhoneNumber())
                .licenseNumber(doctor.getLicenseNumber())
                .specialization(doctor.getSpecialization())
                .yearsOfExperience(doctor.getYearsOfExperience())
                .consultationFee(doctor.getConsultationFee())
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt())
                .build();
    }
}
