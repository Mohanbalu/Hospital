package com.hms.service;

import java.util.List;

import com.hms.dto.BillRequestDTO;
import com.hms.dto.BillResponseDTO;

public interface BillingService {

    BillResponseDTO generateBill(BillRequestDTO request);

    BillResponseDTO updatePaymentStatus(Long id, BillRequestDTO request);

    BillResponseDTO getBillById(Long id);

    List<BillResponseDTO> getAllBills();
}
