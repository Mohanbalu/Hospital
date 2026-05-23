import { ROLES } from './constants';

export const roleGroups = {
  adminOnly: [ROLES.ADMIN],
  adminAndReceptionist: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  adminDoctorReceptionist: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
  clinicalStaff: [ROLES.ADMIN, ROLES.DOCTOR],
  patientAccessible: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT],
};

export const hasRoleAccess = (role, allowedRoles = []) => allowedRoles.length === 0 || allowedRoles.includes(role);

export const canManagePatients = (role) => hasRoleAccess(role, roleGroups.adminAndReceptionist);
export const canManageDoctors = (role) => hasRoleAccess(role, roleGroups.adminOnly);
export const canManageAppointments = (role) => hasRoleAccess(role, roleGroups.adminDoctorReceptionist);
export const canManageBilling = (role) => hasRoleAccess(role, roleGroups.adminAndReceptionist);
export const canViewClinicalData = (role) => hasRoleAccess(role, roleGroups.clinicalStaff);