import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router"

import ApplicationUserProvider from "@/components/auth/ApplicationUserProvider"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import ReNoteClerkProvider from "@/components/auth/ReNoteClerkProvider"
import RequireRole from "@/components/auth/RequireRole"
import PrototypeDataProvider from "@/components/app/PrototypeDataProvider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { APP_PAGE_ACCESS } from "@/routes/appPageAccess"
import AppLayout from "@/layouts/AppLayout"
import PublicLayout from "@/layouts/PublicLayout"
import AdminPlaceholderPage from "@/pages/app/AdminPlaceholderPage"
import CourseArchivePage from "@/pages/app/CourseArchivePage"
import CoursesPage from "@/pages/app/CoursesPage"
import CourseSearchPage from "@/pages/app/CourseSearchPage"
import CourseWorkspacePage from "@/pages/app/CourseWorkspacePage"
import FacultyMaterialsPage from "@/pages/app/FacultyMaterialsPage"
import ProfilePage from "@/pages/app/ProfilePage"
import ResourceDetailPage from "@/pages/app/ResourceDetailPage"
import RoleDashboardPage from "@/pages/app/RoleDashboardPage"
import StudentNotificationsPage from "@/pages/app/StudentNotificationsPage"
import NotFoundPage from "@/pages/errors/NotFoundPage"
import LandingPage from "@/pages/public/LandingPage"
import RoleSelectionPage from "@/pages/public/RoleSelectionPage"
import SignInPage from "@/pages/public/SignInPage"
import SignUpPage from "@/pages/public/SignUpPage"

function App() {
  return (
    <BrowserRouter>
      <ReNoteClerkProvider>
        <ApplicationUserProvider>
          <PrototypeDataProvider>
            <TooltipProvider>
              <Routes>
                <Route path="sign-in/*" element={<SignInPage />} />
                <Route path="sign-up/*" element={<SignUpPage />} />

                <Route element={<PublicLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route
                    path="role-selection"
                    element={
                      <ProtectedRoute>
                        <RoleSelectionPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route
                  path="dashboard"
                  element={<Navigate to="/app/dashboard" replace />}
                />
                <Route
                  path="app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<RoleDashboardPage />} />
                  <Route
                    path="archive"
                    element={
                      <RequireRole allowedRoles={APP_PAGE_ACCESS.ARCHIVE}>
                        <CourseArchivePage />
                      </RequireRole>
                    }
                  />
                  <Route
                    element={
                      <RequireRole allowedRoles={APP_PAGE_ACCESS.COURSES}>
                        <Outlet />
                      </RequireRole>
                    }
                  >
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="my-repositories" element={<Navigate to="/app/courses" replace />} />
                    <Route path="files/:fileId" element={<ResourceDetailPage />} />
                    <Route path="workspace/:repositoryId" element={<CourseWorkspacePage />} />
                    <Route path="summaries/:summaryId" element={<Navigate to="/app/courses" replace />} />
                  </Route>
                  <Route
                    path="search"
                    element={
                      <RequireRole allowedRoles={APP_PAGE_ACCESS.SEARCH}>
                        <CourseSearchPage />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="notifications"
                    element={
                      <RequireRole allowedRoles={APP_PAGE_ACCESS.NOTIFICATIONS}>
                        <StudentNotificationsPage />
                      </RequireRole>
                    }
                  />
                  <Route
                    path="materials"
                    element={
                      <RequireRole allowedRoles={APP_PAGE_ACCESS.MATERIALS}>
                        <FacultyMaterialsPage />
                      </RequireRole>
                    }
                  />
                  <Route path="profile" element={<Navigate to="/app/settings" replace />} />
                  <Route path="settings" element={<ProfilePage />} />
                  <Route
                    path="admin"
                    element={
                      <RequireRole allowedRoles={APP_PAGE_ACCESS.ADMIN}>
                        <Outlet />
                      </RequireRole>
                    }
                  >
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="users" element={<AdminPlaceholderPage page="users" />} />
                    <Route path="content" element={<AdminPlaceholderPage page="content" />} />
                    <Route path="usage" element={<AdminPlaceholderPage page="usage" />} />
                    <Route path="ai-usage" element={<AdminPlaceholderPage page="aiUsage" />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </PrototypeDataProvider>
        </ApplicationUserProvider>
      </ReNoteClerkProvider>
    </BrowserRouter>
  )
}

export default App
