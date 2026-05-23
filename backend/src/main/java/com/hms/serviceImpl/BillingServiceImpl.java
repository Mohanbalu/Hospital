package com.hms.serviceImpl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.BillRequestDTO;
import com.hms.dto.BillResponseDTO;
import com.hms.entity.Appointment;
import com.hms.entity.Bill;
import com.hms.entity.Patient;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillRepository;
import com.hms.repository.PatientRepository;
import com.hms.service.BillingService;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingServiceImpl implements BillingService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public BillResponseDTO generateBill(BillRequestDTO request) {
        log.info("Generating bill for patient {}", request.getPatientId());
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + request.getAppointmentId()));
            if (!appointment.getPatient().getId().equals(patient.getId())) {
                throw new ValidationException("Appointment does not belong to the patient");
            }
        }
        Bill bill = Bill.builder()
                .patient(patient)
                .appointment(appointment)
                .billNumber(generateBillNumber())
                .issueDate(request.getIssueDate())
                .dueDate(request.getDueDate())
                .totalAmount(request.getTotalAmount())
                .status(request.getStatus().trim())
                .build();
        return mapToBillResponse(billRepository.save(bill));
    }

    @Override
    @Transactional
    public BillResponseDTO updatePaymentStatus(Long id, BillRequestDTO request) {
        log.info("Updating payment status for bill {}", id);
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            throw new ValidationException("Bill status is required");
        }
        bill.setStatus(request.getStatus().trim());
        return mapToBillResponse(billRepository.save(bill));
    }

    @Override
    public BillResponseDTO getBillById(Long id) {
        log.info("Fetching bill with id {}", id);
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return mapToBillResponse(bill);
    }

    @Override
    public List<BillResponseDTO> getAllBills() {
        log.info("Fetching all bills");
        return billRepository.findAll().stream()
                .map(this::mapToBillResponse)
                .collect(Collectors.toList());
    }

    private String generateBillNumber() {
        return "BILL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BillResponseDTO mapToBillResponse(Bill bill) {
        return BillResponseDTO.builder()
                .id(bill.getId())
                .billNumber(bill.getBillNumber())
                .patientId(bill.getPatient().getId())
                .patientName(String.format("%s %s", bill.getPatient().getFirstName(), bill.getPatient().getLastName()))
                .appointmentId(bill.getAppointment() != null ? bill.getAppointment().getId() : null)
                .issueDate(bill.getIssueDate())
                .dueDate(bill.getDueDate())
                .totalAmount(bill.getTotalAmount())
                .status(bill.getStatus())
                .createdAt(bill.getCreatedAt())
                .updatedAt(bill.getUpdatedAt())
                .build();
    }
}
