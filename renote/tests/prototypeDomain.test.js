import assert from "node:assert/strict"
import test from "node:test"

import {
  createPrototypeState,
  prototypeDataReducer,
  PUBLICATION_STATUS,
  PROCESSING_STATUS,
  selectArchiveForUser,
  selectCourseForUser,
  selectCourseResources,
  selectCoursesForUser,
  selectFacultyMaterials,
  selectResourceForUser,
  selectStudentNotifications,
  selectStudentSearch,
  selectTopicsForCourse,
} from "../src/data/prototypeDomain.js"
import { APP_ROLES } from "../src/lib/roles.js"

const student = { id: "clerk-demo", displayName: "Demo User", role: APP_ROLES.STUDENT }
const faculty = { ...student, role: APP_ROLES.FACULTY }
const initial = createPrototypeState(student)

test("Student My Courses follows membership rather than global faculty ownership", () => {
  assert.deepEqual(
    selectCoursesForUser(initial, student).map((course) => course.id),
    ["course-information-assurance", "course-technical-communication"]
  )
  assert.equal(selectCourseForUser(initial, "course-capstone-research", student), null)
  assert.equal(selectCourseForUser(initial, "course-archived-example", student), null)
})

test("Faculty My Courses and Materials follow current-user ownership", () => {
  assert.deepEqual(
    selectCoursesForUser(initial, faculty).map((course) => course.id),
    ["course-information-assurance", "course-capstone-research"]
  )
  const materials = selectFacultyMaterials(initial, faculty)
  assert.ok(materials.some((resource) => resource.id === "resource-ia-threat-model"))
  assert.ok(materials.every((resource) => resource.courseId !== "course-technical-communication"))
  assert.deepEqual(
    selectFacultyMaterials(initial, faculty, { publicationStatus: "draft", resourceType: "link" })
      .map((resource) => resource.id),
    ["resource-capstone-literature"]
  )
})

test("Draft and archive visibility are independent of processing and publication", () => {
  const studentIds = selectCourseResources(initial, "course-information-assurance", student)
    .map((resource) => resource.id)
  const facultyIds = selectCourseResources(initial, "course-information-assurance", faculty)
    .map((resource) => resource.id)
  assert.equal(studentIds.includes("resource-ia-threat-model"), false)
  assert.equal(facultyIds.includes("resource-ia-threat-model"), true)
  assert.equal(selectResourceForUser(initial, "resource-ia-threat-model", student), null)
  assert.equal(selectResourceForUser(initial, "resource-ia-threat-model", faculty)?.processingStatus, PROCESSING_STATUS.READY)
  assert.equal(studentIds.includes("resource-ia-archived"), false)
  assert.equal(facultyIds.includes("resource-ia-archived"), false)
  assert.equal(initial.resources.find((resource) => resource.id === "resource-ia-archived")?.publicationStatus, PUBLICATION_STATUS.PUBLISHED)
  assert.ok(selectArchiveForUser(initial, faculty).resources.some((resource) => resource.id === "resource-ia-archived"))
  assert.equal(selectArchiveForUser(initial, student).resources.length, 0)
  assert.equal(selectStudentSearch(initial, student, "Threat Modeling Workshop").resources.length, 0)
})

test("Topics are ordered one level under Course and every Resource has one matching Topic", () => {
  assert.deepEqual(
    selectTopicsForCourse(initial, "course-information-assurance").map((topic) => topic.order),
    [1, 2, 3, 4]
  )
  assert.ok(initial.topics.every((topic) => !("parentId" in topic)))
  assert.ok(initial.resources.every((resource) =>
    initial.topics.some((topic) => topic.id === resource.topicId && topic.courseId === resource.courseId)
  ))
  assert.throws(() => prototypeDataReducer(initial, {
    type: "topic/added",
    topic: { id: "nested", courseId: "course-information-assurance", title: "Nested", order: 5, parentId: "topic-ia-1" },
  }))
})

test("Reducer additions resolve through the same selectors used by pages", () => {
  const course = {
    id: "course-new",
    title: "New Prototype Course",
    courseCode: "IT 499",
    subject: "Capstone",
    facultyOwnerId: faculty.id,
    facultyName: faculty.displayName,
    status: "active",
  }
  const topic = { id: "topic-new", courseId: course.id, title: "Week 1", order: 1 }
  const resource = {
    id: "resource-new",
    courseId: course.id,
    topicId: topic.id,
    resourceType: "link",
    title: "Course Reading",
    url: "https://example.edu/reading",
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    processingStatus: PROCESSING_STATUS.PENDING,
    uploadedBy: faculty.id,
  }
  let state = prototypeDataReducer(initial, { type: "course/added", course })
  state = prototypeDataReducer(state, { type: "topic/added", topic })
  state = prototypeDataReducer(state, { type: "resource/added", resource })
  state = prototypeDataReducer(state, {
    type: "membership/added",
    membership: { id: "membership-new", courseId: course.id, userId: student.id, joinedAt: "2026-09-20T08:00:00Z" },
  })

  assert.equal(selectCourseForUser(state, course.id, faculty)?.title, course.title)
  assert.equal(selectCourseForUser(state, course.id, student)?.title, course.title)
  assert.equal(selectResourceForUser(state, resource.id, faculty)?.title, resource.title)
  assert.equal(selectResourceForUser(state, resource.id, student)?.title, resource.title)
  assert.equal(selectStudentSearch(state, student, "IT 499").resources[0]?.id, resource.id)
  assert.throws(() => prototypeDataReducer(state, {
    type: "resource/added",
    resource: { ...resource, id: "bad-resource", courseId: "course-capstone-research" },
  }))
})

test("Notifications reference visible Course and Resource IDs", () => {
  const notifications = selectStudentNotifications(initial, student)
  assert.equal(notifications.length, 1)
  assert.ok(initial.courses.some((course) => course.id === notifications[0].courseId))
  assert.ok(selectResourceForUser(initial, notifications[0].resourceId, student))
})
