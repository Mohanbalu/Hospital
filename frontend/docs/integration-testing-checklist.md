# Integration Testing Checklist

## Auth

- Verify `POST /api/auth/login` returns `token` and `role`.
- Confirm the token is stored in `localStorage` under the HMS auth key.
- Confirm `logout()` clears local storage and redirects to `/login`.
- Confirm expired tokens are removed automatically.

## Headers

- Check `Authorization: Bearer <token>` is attached to protected requests.
- Confirm auth endpoints are called without the bearer header.

## CRUD

- Create, update, delete, and list patients.
- Create, update, delete, and list doctors.
- Book, reschedule, cancel, and list appointments.
- Generate bills, update payment status, and fetch bill details.

## DTO Matching

- Verify frontend payload field names match backend request DTOs.
- Verify backend response fields map directly to table and form state.
- Confirm numeric form values are converted before submission.

## Response Consistency

- Verify `ApiResponse` envelopes are unwrapped correctly.
- Verify raw login responses are parsed correctly.
- Verify null or empty API responses do not crash the UI.

## Failure Paths

- Simulate `400` validation responses and show field-level messages.
- Simulate `401` and confirm logout plus redirect.
- Simulate `403` and confirm a permission message is shown.
- Simulate `404` and `500` responses and show user-friendly fallback messages.

## Role Access

- ADMIN can access all admin routes.
- DOCTOR can access appointments and prescriptions.
- PATIENT can access own appointments and bills.
- RECEPTIONIST can access patients and appointments.

## UI States

- Loading indicator appears during each fetch and submit.
- Empty state appears when lists have no records.
- Retry behavior preserves the last successful page state.
