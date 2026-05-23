# JWT Authentication and Role Authorization - Postman Examples

Base URL: `http://localhost:8080`

## 1) Register Admin

**Request**
- Method: `POST`
- URL: `/api/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body:
```json
{
  "name": "System Admin",
  "email": "admin@hms.com",
  "password": "Admin@1234",
  "role": "ADMIN"
}
```

## 2) Register Doctor

**Request**
- Method: `POST`
- URL: `/api/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body:
```json
{
  "name": "Dr. Sarah Khan",
  "email": "doctor@hms.com",
  "password": "Doctor@1234",
  "role": "DOCTOR"
}
```

## 3) Login

**Request**
- Method: `POST`
- URL: `/api/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body:
```json
{
  "email": "admin@hms.com",
  "password": "Admin@1234"
}
```

**Expected response**
```json
{
  "token": "<jwt-token>",
  "role": "ADMIN",
  "message": "Login successful"
}
```

## 4) Access a Secured API Using JWT

**Request**
- Method: `GET`
- URL: `/api/access/admin`
- Headers:
  - `Authorization: Bearer <jwt-token>`

**Other role demo endpoints**
- `GET /api/access/doctor`
- `GET /api/access/patient`
- `GET /api/access/receptionist`

## 5) Role Mapping Notes

- `ADMIN` -> full access
- `DOCTOR` -> doctor-secured demo endpoint
- `PATIENT` -> patient-secured demo endpoint
- `RECEPTIONIST` -> receptionist-secured demo endpoint

## 6) Patient API Examples

### Create Patient
- Method: `POST`
- URL: `/api/patients`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "firstName": "Rohit",
  "lastName": "Patel",
  "gender": "Male",
  "dateOfBirth": "1988-04-12",
  "email": "rohit.patel@hospital.com",
  "phoneNumber": "+919876543210",
  "address": "102 Medical Avenue, Pune",
  "bloodGroup": "O+",
  "emergencyContactName": "Anita Patel",
  "emergencyContactPhone": "+919123456789"
}
```

### Update Patient
- Method: `PUT`
- URL: `/api/patients/{id}`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "firstName": "Rohit",
  "lastName": "Patel",
  "gender": "Male",
  "dateOfBirth": "1988-04-12",
  "email": "rohit.patel@hospital.com",
  "phoneNumber": "+919876543210",
  "address": "202 Clinic Road, Pune",
  "bloodGroup": "O+",
  "emergencyContactName": "Anita Patel",
  "emergencyContactPhone": "+919123456789"
}
```

### Delete Patient
- Method: `DELETE`
- URL: `/api/patients/{id}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Get Patient by ID
- Method: `GET`
- URL: `/api/patients/{id}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Search Patients
- Method: `GET`
- URL: `/api/patients/search?name=Rohit`
- Headers:
  - `Authorization: Bearer <jwt-token>`

## 7) Doctor API Examples

### Create Doctor
- Method: `POST`
- URL: `/api/doctors`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "departmentId": 1,
  "firstName": "Anjali",
  "lastName": "Sharma",
  "email": "anjali.sharma@hospital.com",
  "phoneNumber": "+919876543211",
  "licenseNumber": "DOC-78945",
  "specialization": "Cardiology",
  "yearsOfExperience": 12,
  "consultationFee": 1200.00
}
```

### Update Doctor
- Method: `PUT`
- URL: `/api/doctors/{id}`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "departmentId": 1,
  "firstName": "Anjali",
  "lastName": "Sharma",
  "email": "anjali.sharma@hospital.com",
  "phoneNumber": "+919876543211",
  "licenseNumber": "DOC-78945",
  "specialization": "Cardiology",
  "yearsOfExperience": 13,
  "consultationFee": 1300.00
}
```

### Delete Doctor
- Method: `DELETE`
- URL: `/api/doctors/{id}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Get All Doctors
- Method: `GET`
- URL: `/api/doctors`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Search Doctors by Specialization
- Method: `GET`
- URL: `/api/doctors/specialization?specialization=Cardiology`
- Headers:
  - `Authorization: Bearer <jwt-token>`

## 8) Appointment API Examples

### Book Appointment
- Method: `POST`
- URL: `/api/appointments`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "patientId": 1,
  "doctorId": 1,
  "appointmentDateTime": "2026-06-05T10:30:00",
  "reason": "Annual cardiac checkup",
  "notes": "Patient has history of hypertension"
}
```

### Reschedule Appointment
- Method: `PUT`
- URL: `/api/appointments/reschedule/{id}`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "patientId": 1,
  "doctorId": 1,
  "appointmentDateTime": "2026-06-07T11:00:00",
  "reason": "Rescheduled follow-up",
  "notes": "Patient requested later slot"
}
```

### Cancel Appointment
- Method: `PUT`
- URL: `/api/appointments/cancel/{id}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Get Appointment by ID
- Method: `GET`
- URL: `/api/appointments/{id}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Get All Appointments
- Method: `GET`
- URL: `/api/appointments`
- Headers:
  - `Authorization: Bearer <jwt-token>`

## 9) Prescription API Examples

### Create Prescription
- Method: `POST`
- URL: `/api/prescriptions`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "appointmentId": 1,
  "diagnosis": "Hypertension",
  "medication": "Amlodipine 5mg",
  "dosage": "Once daily",
  "instructions": "Take in the morning with water"
}
```

### Get Prescriptions by Patient
- Method: `GET`
- URL: `/api/prescriptions/patient/{patientId}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Get Prescription by Appointment
- Method: `GET`
- URL: `/api/prescriptions/appointment/{appointmentId}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

## 10) Billing API Examples

### Create Bill
- Method: `POST`
- URL: `/api/bills`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "patientId": 1,
  "appointmentId": 1,
  "issueDate": "2026-06-05",
  "dueDate": "2026-06-20",
  "totalAmount": 4500.00,
  "status": "PENDING"
}
```

### Update Bill Payment Status
- Method: `PUT`
- URL: `/api/bills/payment/{id}`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "patientId": 1,
  "issueDate": "2026-06-05",
  "dueDate": "2026-06-20",
  "totalAmount": 4500.00,
  "status": "PAID"
}
```

### Get Bill by ID
- Method: `GET`
- URL: `/api/bills/{id}`
- Headers:
  - `Authorization: Bearer <jwt-token>`

### Get All Bills
- Method: `GET`
- URL: `/api/bills`
- Headers:
  - `Authorization: Bearer <jwt-token>`
