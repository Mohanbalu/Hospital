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
