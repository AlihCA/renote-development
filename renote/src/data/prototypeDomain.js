import { APP_ROLES } from "../lib/roles.js"
import { prototypeCourses } from "./prototypeCourses.js"
import { prototypeMemberships } from "./prototypeMemberships.js"
import { prototypeNotifications } from "./prototypeNotifications.js"
import { prototypeResources } from "./prototypeResources.js"
import { prototypeTopics } from "./prototypeTopics.js"

export const PUBLICATION_STATUS = Object.freeze({ DRAFT: "draft", PUBLISHED: "published" })
export const PROCESSING_STATUS = Object.freeze({
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
})
export const RESOURCE_TYPE = Object.freeze({ FILE: "file", LINK: "link" })

const demoFacultyId = "prototype-faculty-owner"
const demoStudentId = "prototype-student-member"

export function createPrototypeState(appUser) {
  if (!appUser?.id) throw new Error("A Clerk-backed application user is required.")

  return {
    courses: prototypeCourses.map((course) => ({
      ...course,
      facultyOwnerId: course.facultyOwnerId === demoFacultyId ? appUser.id : course.facultyOwnerId,
      facultyName: course.facultyOwnerId === demoFacultyId
        ? appUser.displayName ?? "Faculty Demo"
        : course.facultyName,
    })),
    memberships: prototypeMemberships.map((membership) => ({
      ...membership,
      userId: membership.userId === demoStudentId ? appUser.id : membership.userId,
    })),
    topics: prototypeTopics.map((topic) => ({ ...topic })),
    resources: prototypeResources.map((resource) => ({
      ...resource,
      uploadedBy: resource.uploadedBy === demoFacultyId ? appUser.id : resource.uploadedBy,
    })),
    notifications: prototypeNotifications.map((notification) => ({
      ...notification,
      recipientUserId: notification.recipientUserId === demoStudentId
        ? appUser.id
        : notification.recipientUserId,
    })),
  }
}

function assertNewId(items, id) {
  if (!id || items.some((item) => item.id === id)) {
    throw new Error("A unique entity ID is required.")
  }
}

// The reducer is shared by every active Course/Resource page. Step 6 can add UI actions.
export function prototypeDataReducer(state, action) {
  switch (action.type) {
    case "course/added": {
      const course = action.course
      assertNewId(state.courses, course?.id)
      if (!course.facultyOwnerId || !course.title || !course.courseCode) {
        throw new Error("A Course needs an owner, title, and code.")
      }
      return { ...state, courses: [...state.courses, course] }
    }
    case "membership/added": {
      const membership = action.membership
      assertNewId(state.memberships, membership?.id)
      if (!state.courses.some((course) => course.id === membership.courseId) || !membership.userId) {
        throw new Error("Membership must reference a Course and user.")
      }
      if (state.memberships.some((item) => item.courseId === membership.courseId && item.userId === membership.userId)) {
        throw new Error("The user is already a member of this Course.")
      }
      return { ...state, memberships: [...state.memberships, membership] }
    }
    case "topic/added": {
      const topic = action.topic
      assertNewId(state.topics, topic?.id)
      if (!state.courses.some((course) => course.id === topic.courseId) || !Number.isInteger(topic.order) || "parentId" in topic) {
        throw new Error("A Topic must belong directly to a Course and have an order.")
      }
      return { ...state, topics: [...state.topics, topic] }
    }
    case "resource/added": {
      const resource = action.resource
      assertNewId(state.resources, resource?.id)
      const topic = state.topics.find((item) => item.id === resource.topicId)
      if (!topic || topic.courseId !== resource.courseId || "parentId" in resource) {
        throw new Error("A Resource must belong directly to a Topic in its Course.")
      }
      if (!Object.values(RESOURCE_TYPE).includes(resource.resourceType)
        || !Object.values(PUBLICATION_STATUS).includes(resource.publicationStatus)
        || !Object.values(PROCESSING_STATUS).includes(resource.processingStatus)) {
        throw new Error("Resource type and statuses must be valid.")
      }
      if (!resource.title || (resource.resourceType === RESOURCE_TYPE.FILE && !resource.fileName)
        || (resource.resourceType === RESOURCE_TYPE.LINK && !resource.url)) {
        throw new Error("A Resource needs a title and file name or URL.")
      }
      return { ...state, resources: [...state.resources, resource] }
    }
    default:
      return state
  }
}

export function selectCoursesForUser(state, appUser) {
  if (!appUser) return []

  if (appUser.role === APP_ROLES.STUDENT) {
    const joinedIds = new Set(
      state.memberships
        .filter((membership) => membership.userId === appUser.id)
        .map((membership) => membership.courseId)
    )
    return state.courses.filter((course) => joinedIds.has(course.id) && !course.archivedAt)
  }

  if (appUser.role === APP_ROLES.FACULTY) {
    return state.courses.filter(
      (course) => course.facultyOwnerId === appUser.id && !course.archivedAt
    )
  }

  return []
}

export function selectCourseForUser(state, courseId, appUser) {
  return selectCoursesForUser(state, appUser).find((course) => course.id === courseId) ?? null
}

export function selectTopicsForCourse(state, courseId) {
  return state.topics
    .filter((topic) => topic.courseId === courseId)
    .sort((first, second) => first.order - second.order)
}

export function selectCourseResources(state, courseId, appUser) {
  if (!selectCourseForUser(state, courseId, appUser)) return []

  return state.resources.filter((resource) =>
    resource.courseId === courseId
    && !resource.archivedAt
    && (appUser.role === APP_ROLES.FACULTY
      || resource.publicationStatus === PUBLICATION_STATUS.PUBLISHED)
  )
}

export function selectResourceForUser(state, resourceId, appUser) {
  const resource = state.resources.find((item) => item.id === resourceId)
  if (!resource) return null
  return selectCourseResources(state, resource.courseId, appUser)
    .find((item) => item.id === resourceId) ?? null
}

export function selectFacultyMaterials(state, appUser, filters = {}) {
  if (appUser?.role !== APP_ROLES.FACULTY) return []
  const ownedCourses = selectCoursesForUser(state, appUser)
  const courseById = new Map(ownedCourses.map((course) => [course.id, course]))
  const query = String(filters.query ?? "").trim().toLowerCase()

  return state.resources.filter((resource) => {
    const course = courseById.get(resource.courseId)
    if (!course || resource.archivedAt) return false
    if (filters.courseId && filters.courseId !== resource.courseId) return false
    if (filters.topicId && filters.topicId !== resource.topicId) return false
    if (filters.publicationStatus && filters.publicationStatus !== resource.publicationStatus) return false
    if (filters.resourceType && filters.resourceType !== resource.resourceType) return false
    return !query || [resource.title, resource.fileType, course.title, course.courseCode]
      .some((value) => String(value ?? "").toLowerCase().includes(query))
  })
}

export function selectStudentSearch(state, appUser, query = "") {
  if (appUser?.role !== APP_ROLES.STUDENT) return { courses: [], resources: [] }
  const availableCourses = selectCoursesForUser(state, appUser)
  const normalized = String(query).trim().toLowerCase()
  const matches = (values) => !normalized || values.some(
    (value) => String(value ?? "").toLowerCase().includes(normalized)
  )

  return {
    courses: availableCourses.filter((course) =>
      matches([course.title, course.courseCode, course.subject])
    ),
    resources: availableCourses.flatMap((course) =>
      selectCourseResources(state, course.id, appUser).filter((resource) =>
        matches([resource.title, resource.fileType, course.title, course.courseCode])
      )
    ),
  }
}

export function selectStudentNotifications(state, appUser) {
  if (appUser?.role !== APP_ROLES.STUDENT) return []
  return state.notifications.filter((notification) => {
    if (notification.recipientUserId !== appUser.id) return false
    const resource = selectResourceForUser(state, notification.resourceId, appUser)
    return resource?.courseId === notification.courseId
  })
}

export function selectArchiveForUser(state, appUser) {
  if (![APP_ROLES.FACULTY, APP_ROLES.ADMIN].includes(appUser?.role)) {
    return { courses: [], resources: [] }
  }

  const managedCourseIds = new Set(state.courses
    .filter((course) => appUser.role === APP_ROLES.ADMIN || course.facultyOwnerId === appUser.id)
    .map((course) => course.id))

  return {
    courses: state.courses.filter((course) => managedCourseIds.has(course.id) && course.archivedAt),
    resources: state.resources.filter((resource) => managedCourseIds.has(resource.courseId) && resource.archivedAt),
  }
}
