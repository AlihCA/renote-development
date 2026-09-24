import assert from "node:assert/strict"
import test from "node:test"

import { getAppNavItems } from "../src/data/navigation.js"
import { readPrototypeRole, writePrototypeRole } from "../src/lib/prototypeRoleStore.js"
import { APP_PAGE_ACCESS } from "../src/routes/appPageAccess.js"
import {
  APPLICATION_ROLES,
  APP_ROLES,
  canAccessRole,
  normalizeApplicationRole,
} from "../src/lib/roles.js"

function createStorage() {
  const entries = new Map()
  return {
    entries,
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  }
}

test("only Student, Faculty, and Admin are application roles", () => {
  assert.deepEqual(APPLICATION_ROLES, [APP_ROLES.STUDENT, APP_ROLES.FACULTY, APP_ROLES.ADMIN])
  assert.equal(normalizeApplicationRole("guest"), APP_ROLES.STUDENT)
  assert.equal(normalizeApplicationRole("institution"), APP_ROLES.STUDENT)
})

test("prototype role switches persist separately for each Clerk user", () => {
  const storage = createStorage()
  assert.equal(readPrototypeRole("clerk-student", storage), APP_ROLES.STUDENT)

  writePrototypeRole("clerk-student", APP_ROLES.FACULTY, storage)
  writePrototypeRole("clerk-student", APP_ROLES.ADMIN, storage)
  writePrototypeRole("clerk-student", APP_ROLES.STUDENT, storage)
  writePrototypeRole("clerk-faculty", APP_ROLES.FACULTY, storage)
  writePrototypeRole("clerk-admin", APP_ROLES.ADMIN, storage)
  assert.equal(readPrototypeRole("clerk-faculty", storage), APP_ROLES.FACULTY)
  assert.equal(readPrototypeRole("clerk-admin", storage), APP_ROLES.ADMIN)
  assert.equal(readPrototypeRole("clerk-student", storage), APP_ROLES.STUDENT)
  assert.ok([...storage.entries.keys()].every((key) => key.startsWith("renote:prototype-role:v1:")))
  assert.throws(() => writePrototypeRole("clerk-student", "guest", storage))
})

test("each role receives only its intended primary navigation", () => {
  const expectedPaths = {
    [APP_ROLES.STUDENT]: ["/app/dashboard", "/app/courses", "/app/search", "/app/notifications", "/app/settings"],
    [APP_ROLES.FACULTY]: ["/app/dashboard", "/app/courses", "/app/materials", "/app/settings"],
    [APP_ROLES.ADMIN]: ["/app/dashboard", "/app/admin/users", "/app/admin/content", "/app/admin/usage", "/app/admin/ai-usage", "/app/settings"],
  }

  for (const role of APPLICATION_ROLES) {
    const items = getAppNavItems(role)
    assert.deepEqual(items.map((item) => item.href), expectedPaths[role])
    assert.ok(items.every((item) => canAccessRole(role, item.allowedRoles)))
    assert.ok(items.every((item) => item.href !== "/app/archive"))
  }
})

test("direct-route policies separate student, faculty, and admin pages", () => {
  assert.equal(canAccessRole(APP_ROLES.STUDENT, APP_PAGE_ACCESS.COURSES), true)
  assert.equal(canAccessRole(APP_ROLES.STUDENT, APP_PAGE_ACCESS.SEARCH), true)
  assert.equal(canAccessRole(APP_ROLES.STUDENT, APP_PAGE_ACCESS.NOTIFICATIONS), true)
  assert.equal(canAccessRole(APP_ROLES.STUDENT, APP_PAGE_ACCESS.MATERIALS), false)
  assert.equal(canAccessRole(APP_ROLES.STUDENT, APP_PAGE_ACCESS.ADMIN), false)

  assert.equal(canAccessRole(APP_ROLES.FACULTY, APP_PAGE_ACCESS.COURSES), true)
  assert.equal(canAccessRole(APP_ROLES.FACULTY, APP_PAGE_ACCESS.MATERIALS), true)
  assert.equal(canAccessRole(APP_ROLES.FACULTY, APP_PAGE_ACCESS.ADMIN), false)

  assert.equal(canAccessRole(APP_ROLES.ADMIN, APP_PAGE_ACCESS.ADMIN), true)
  assert.equal(canAccessRole(APP_ROLES.ADMIN, APP_PAGE_ACCESS.COURSES), false)
  assert.equal(canAccessRole(APP_ROLES.ADMIN, APP_PAGE_ACCESS.MATERIALS), false)
  assert.equal(canAccessRole(APP_ROLES.ADMIN, APP_PAGE_ACCESS.SETTINGS), true)
})

test("switching the demo role changes navigation without another user's state", () => {
  const storage = createStorage()
  const userId = "clerk-demo"

  for (const role of [APP_ROLES.STUDENT, APP_ROLES.FACULTY, APP_ROLES.ADMIN]) {
    writePrototypeRole(userId, role, storage)
    const currentRole = readPrototypeRole(userId, storage)
    const paths = getAppNavItems(currentRole).map((item) => item.href)
    assert.ok(paths.includes("/app/dashboard"))
    assert.equal(paths.some((path) => path.startsWith("/app/admin/")), role === APP_ROLES.ADMIN)
    assert.equal(paths.includes("/app/materials"), role === APP_ROLES.FACULTY)
  }
})
