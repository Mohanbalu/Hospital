USE hospital_management_system;

INSERT INTO roles (id, name, description) VALUES
    (1, 'ADMIN', 'System administrator'),
    (2, 'DOCTOR', 'Medical practitioner'),
    (3, 'PATIENT', 'Hospital patient');

INSERT INTO departments (id, name, description) VALUES
    (1, 'Cardiology', 'Heart and cardiovascular care'),
    (2, 'Orthopedics', 'Bones, joints, and musculoskeletal care'),
    (3, 'General Medicine', 'Primary and general healthcare');

INSERT INTO users (id, role_id, username, password_hash, email, full_name, phone_number, active) VALUES
    (1, 1, 'admin', '$2a$10$QmFzaWNQbGFjZWhvbGRlckhhc2gxMjM0NTY3ODkwMTIzNDU2Nw==', 'admin@hms.com', 'System Admin', '9000000001', TRUE);

INSERT INTO doctors (id, department_id, first_name, last_name, email, phone_number, license_number, specialization, years_of_experience, consultation_fee) VALUES
    (1, 1, 'Aarav', 'Sharma', 'aarav.sharma@hms.com', '9000001001', 'DOC-CARD-001', 'Cardiologist', 12, 1500.00),
    (2, 2, 'Meera', 'Iyer', 'meera.iyer@hms.com', '9000001002', 'DOC-ORTH-002', 'Orthopedic Surgeon', 9, 1200.00),
    (3, 3, 'Rohan', 'Verma', 'rohan.verma@hms.com', '9000001003', 'DOC-GEN-003', 'General Physician', 7, 800.00);

INSERT INTO patients (id, first_name, last_name, gender, date_of_birth, email, phone_number, address, blood_group, emergency_contact_name, emergency_contact_phone) VALUES
    (1, 'Anita', 'Das', 'Female', '1990-05-12', 'anita.das@example.com', '9100000001', '12 Park Street, Kolkata', 'A+', 'Raj Das', '9199990001'),
    (2, 'Karan', 'Malhotra', 'Male', '1987-08-21', 'karan.malhotra@example.com', '9100000002', '44 MG Road, Bengaluru', 'B+', 'Neha Malhotra', '9199990002'),
    (3, 'Pooja', 'Nair', 'Female', '1995-03-09', 'pooja.nair@example.com', '9100000003', '78 Marine Drive, Mumbai', 'O+', 'Arun Nair', '9199990003'),
    (4, 'Siddharth', 'Kapoor', 'Male', '1979-11-17', 'siddharth.kapoor@example.com', '9100000004', '101 Civil Lines, Delhi', 'AB+', 'Priya Kapoor', '9199990004'),
    (5, 'Neha', 'Singh', 'Female', '2001-01-28', 'neha.singh@example.com', '9100000005', '25 Lake View, Pune', 'A-', 'Mohan Singh', '9199990005');

INSERT INTO appointments (id, patient_id, doctor_id, appointment_date_time, status, reason, notes) VALUES
    (1, 1, 1, '2026-05-25 10:00:00', 'SCHEDULED', 'Chest pain evaluation', 'Initial consultation required'),
    (2, 2, 2, '2026-05-25 11:00:00', 'COMPLETED', 'Knee pain follow-up', 'Patient advised for physiotherapy'),
    (3, 3, 3, '2026-05-26 09:30:00', 'SCHEDULED', 'Fever and weakness', 'Routine general checkup'),
    (4, 4, 1, '2026-05-26 14:00:00', 'COMPLETED', 'High blood pressure review', 'Lifestyle changes discussed'),
    (5, 5, 3, '2026-05-27 16:00:00', 'CANCELLED', 'Seasonal allergy consultation', 'Rescheduled by patient');

INSERT INTO prescriptions (id, appointment_id, diagnosis, medication, dosage, instructions, prescribed_at) VALUES
    (1, 2, 'Mild osteoarthritis', 'Pain relief tablets', '1 tablet twice daily for 7 days', 'Take after meals and avoid strenuous activity', '2026-05-25 11:30:00'),
    (2, 4, 'Hypertension', 'Amlodipine', '5 mg once daily', 'Monitor blood pressure daily and reduce salt intake', '2026-05-26 14:30:00');

INSERT INTO medical_records (id, patient_id, record_date, title, description, doctor_notes) VALUES
    (1, 1, '2026-05-25', 'Cardiology Consultation', 'Patient reported intermittent chest discomfort.', 'ECG and blood tests recommended'),
    (2, 2, '2026-05-25', 'Orthopedic Review', 'Pain in the left knee after sports activity.', 'Physiotherapy and rest advised'),
    (3, 3, '2026-05-26', 'General Medicine Visit', 'Fever, fatigue, and mild dehydration.', 'Hydration and paracetamol prescribed'),
    (4, 4, '2026-05-26', 'Hypertension Review', 'Routine monitoring for elevated BP.', 'Continue prescribed medication'),
    (5, 5, '2026-05-27', 'Allergy Assessment', 'Seasonal sneezing and nasal congestion.', 'Antihistamine suggested');

INSERT INTO bills (id, patient_id, appointment_id, bill_number, issue_date, due_date, total_amount, status) VALUES
    (1, 1, 1, 'BILL-2026-0001', '2026-05-25', '2026-06-05', 2500.00, 'PENDING'),
    (2, 2, 2, 'BILL-2026-0002', '2026-05-25', '2026-06-05', 1800.00, 'PAID'),
    (3, 3, 3, 'BILL-2026-0003', '2026-05-26', '2026-06-06', 1200.00, 'PENDING'),
    (4, 4, 4, 'BILL-2026-0004', '2026-05-26', '2026-06-06', 2200.00, 'PAID'),
    (5, 5, 5, 'BILL-2026-0005', '2026-05-27', '2026-06-07', 800.00, 'CANCELLED');

INSERT INTO payments (id, bill_id, payment_date, amount_paid, payment_method, transaction_reference, status) VALUES
    (1, 2, '2026-05-25 12:15:00', 1800.00, 'UPI', 'TXN-20260525-0001', 'SUCCESS'),
    (2, 4, '2026-05-26 15:15:00', 2200.00, 'CARD', 'TXN-20260526-0002', 'SUCCESS');

ALTER TABLE roles AUTO_INCREMENT = 4;
ALTER TABLE departments AUTO_INCREMENT = 4;
ALTER TABLE users AUTO_INCREMENT = 2;
ALTER TABLE doctors AUTO_INCREMENT = 4;
ALTER TABLE patients AUTO_INCREMENT = 6;
ALTER TABLE appointments AUTO_INCREMENT = 6;
ALTER TABLE prescriptions AUTO_INCREMENT = 3;
ALTER TABLE medical_records AUTO_INCREMENT = 6;
ALTER TABLE bills AUTO_INCREMENT = 6;
ALTER TABLE payments AUTO_INCREMENT = 3;