import { APP_ROLES, isApplicationRole, normalizeApplicationRole } from "./roles.js"

// Prototype only: browser storage is editable and must never authorize backend actions.
const STORAGE_PREFIX = "renote:prototype-role:v1:"

function storageKey(clerkUserId) {
  return `${STORAGE_PREFIX}${clerkUserId}`
}

export function readPrototypeRole(clerkUserId, storage) {
  if (!clerkUserId) return APP_ROLES.STUDENT

  try {
    const roleStorage = storage ?? globalThis.localStorage
    return normalizeApplicationRole(roleStorage?.getItem(storageKey(clerkUserId)))
  } catch {
    return APP_ROLES.STUDENT
  }
}

export function writePrototypeRole(clerkUserId, role, storage) {
  if (!clerkUserId || !isApplicationRole(role)) {
    throw new Error("A signed-in Clerk user and a valid application role are required.")
  }

  try {
    const roleStorage = storage ?? globalThis.localStorage
    roleStorage?.setItem(storageKey(clerkUserId), role)
  } catch {
    // The in-memory selection still works if browser storage is unavailable.
  }
}
