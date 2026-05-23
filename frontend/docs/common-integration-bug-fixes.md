# Common Integration Bug Fixes

## 1. DTO mismatch

- Convert frontend field names to backend DTO names before submit.
- Map numeric strings to numbers for IDs, fees, and counts.

## 2. JSON parse errors

- Always send JSON with `Content-Type: application/json`.
- Avoid sending `undefined` for optional fields; use `null` instead.

## 3. Circular JSON issues

- Send plain objects from forms, not React state objects with nested references.
- Do not pass entire component state trees into Axios.

## 4. CORS errors

- Ensure the backend allows the React origin.
- Allow `Authorization` and `Content-Type` headers.
- Ensure the backend permits `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS`.

## 5. Token expiration issues

- Validate tokens before every request.
- Clear stored auth state when expiration is detected.
- Redirect to login on `401` responses.

## 6. Axios interceptor bugs

- Skip bearer injection for auth endpoints.
- Prevent redirect loops when already on `/login`.
- Always return the original config or reject the error promise.

## 7. Backend response mismatch

- Unwrap `ApiResponse` envelopes before the UI reads `data`.
- Handle raw responses and wrapped responses with the same helper.

## 8. Null response handling

- Normalize empty responses to `null` or `[]` as appropriate.
- Guard UI rendering with `Array.isArray(...)` checks.

## 9. Form submission failures

- Show backend validation messages in alert components.
- Keep form inputs controlled and reset loading state in `finally` blocks.
- Convert date and number values before sending to the API.
