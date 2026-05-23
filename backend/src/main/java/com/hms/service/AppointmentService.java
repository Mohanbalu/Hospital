package com.hms.service;

import java.util.List;

import com.hms.dto.AppointmentRequestDTO;
import com.hms.dto.AppointmentResponseDTO;

public interface AppointmentService {

    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request);

    AppointmentResponseDTO rescheduleAppointment(Long id, AppointmentRequestDTO request);

    AppointmentResponseDTO cancelAppointment(Long id);

    List<AppointmentResponseDTO> getAllAppointments();

    AppointmentResponseDTO getAppointmentById(Long id);
}
