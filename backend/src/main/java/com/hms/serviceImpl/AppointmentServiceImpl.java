package com.hms.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.AppointmentRequestDTO;
import com.hms.dto.AppointmentResponseDTO;
import com.hms.entity.Appointment;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.service.AppointmentService;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request) {
        log.info("Booking appointment for patient {} with doctor {}", request.getPatientId(), request.getDoctorId());
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(request.getAppointmentDateTime())
                .reason(request.getReason().trim())
                .notes(request.getNotes())
                .status("SCHEDULED")
                .build();
        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public AppointmentResponseDTO rescheduleAppointment(Long id, AppointmentRequestDTO request) {
        log.info("Rescheduling appointment {}", id);
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        if ("CANCELLED".equalsIgnoreCase(appointment.getStatus())) {
            throw new ValidationException("Cannot reschedule a cancelled appointment");
        }
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason().trim());
        appointment.setNotes(request.getNotes());
        appointment.setStatus("RESCHEDULED");
        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public AppointmentResponseDTO cancelAppointment(Long id) {
        log.info("Cancelling appointment {}", id);
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointment.setStatus("CANCELLED");
        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponseDTO> getAllAppointments() {
        log.info("Fetching all appointments");
        return appointmentRepository.findAll().stream()
                .map(this::mapToAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentResponseDTO getAppointmentById(Long id) {
        log.info("Fetching appointment with id {}", id);
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapToAppointmentResponse(appointment);
    }

    private AppointmentResponseDTO mapToAppointmentResponse(Appointment appointment) {
        return AppointmentResponseDTO.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(String.format("%s %s", appointment.getPatient().getFirstName(), appointment.getPatient().getLastName()))
                .doctorId(appointment.getDoctor().getId())
                .doctorName(String.format("%s %s", appointment.getDoctor().getFirstName(), appointment.getDoctor().getLastName()))
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }
}
