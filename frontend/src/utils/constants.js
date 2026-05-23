export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  RECEPTIONIST: 'RECEPTIONIST',
};

export const ROLE_HOME_ROUTES = {
  [ROLES.ADMIN]: '/dashboard/admin',
  [ROLES.DOCTOR]: '/dashboard/doctor',
  [ROLES.PATIENT]: '/dashboard/patient',
  [ROLES.RECEPTIONIST]: '/dashboard/receptionist',
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
export const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const APPOINTMENT_STATUS_OPTIONS = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
export const BILL_STATUS_OPTIONS = ['PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'];

export const ROLE_OPTIONS = [
  { label: 'Admin', value: ROLES.ADMIN },
  { label: 'Doctor', value: ROLES.DOCTOR },
  { label: 'Patient', value: ROLES.PATIENT },
  { label: 'Receptionist', value: ROLES.RECEPTIONIST },
];

export const SIDEBAR_MENUS = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/dashboard/admin', icon: 'dashboard' },
    { label: 'Patients', path: '/patients', icon: 'users' },
    { label: 'Doctors', path: '/doctors', icon: 'stethoscope' },
    { label: 'Appointments', path: '/appointments', icon: 'calendar' },
    { label: 'Billing', path: '/billing', icon: 'billing' },
  ],
  [ROLES.DOCTOR]: [
    { label: 'Dashboard', path: '/dashboard/doctor', icon: 'dashboard' },
    { label: 'Appointments', path: '/appointments', icon: 'calendar' },
    { label: 'Prescriptions', path: '/prescriptions', icon: 'file' },
  ],
  [ROLES.PATIENT]: [
    { label: 'Dashboard', path: '/dashboard/patient', icon: 'dashboard' },
    { label: 'Appointments', path: '/appointments', icon: 'calendar' },
    { label: 'Bills', path: '/billing', icon: 'billing' },
  ],
  [ROLES.RECEPTIONIST]: [
    { label: 'Dashboard', path: '/dashboard/receptionist', icon: 'dashboard' },
    { label: 'Patients', path: '/patients', icon: 'users' },
    { label: 'Appointments', path: '/appointments', icon: 'calendar' },
  ],
};
