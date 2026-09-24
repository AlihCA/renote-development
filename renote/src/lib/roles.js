export const APP_ROLES = Object.freeze({
  STUDENT: "student",
  FACULTY: "faculty",
  ADMIN: "admin",
})

export const APPLICATION_ROLES = Object.freeze(Object.values(APP_ROLES))

export const APP_ROUTE_ROLES = Object.freeze({
  ARCHIVE: Object.freeze([APP_ROLES.FACULTY, APP_ROLES.ADMIN]),
})

const roleLabels = {
  [APP_ROLES.STUDENT]: "Student",
  [APP_ROLES.FACULTY]: "Faculty",
  [APP_ROLES.ADMIN]: "Admin",
}

export function isApplicationRole(role) {
  return APPLICATION_ROLES.includes(role)
}

export function normalizeApplicationRole(role) {
  return isApplicationRole(role) ? role : APP_ROLES.STUDENT
}

export function getRoleLabel(role) {
  return roleLabels[role] ?? roleLabels[APP_ROLES.STUDENT]
}

export function canAccessRole(role, allowedRoles) {
  return isApplicationRole(role) && allowedRoles.includes(role)
}
