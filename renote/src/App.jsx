import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import ReNoteClerkProvider from "@/components/auth/ReNoteClerkProvider"
import AppLayout from "@/layouts/AppLayout"
import PublicLayout from "@/layouts/PublicLayout"
import ArchiveTrashPage from "@/pages/app/ArchiveTrashPage"
import DesignSystemPage from "@/pages/app/DesignSystemPage"
import DashboardPage from "@/pages/app/DashboardPage"
import FilePreviewPage from "@/pages/app/FilePreviewPage"
import MyRepositoriesPage from "@/pages/app/MyRepositoriesPage"
import NotificationsPage from "@/pages/app/NotificationsPage"
import ProfilePage from "@/pages/app/ProfilePage"
import RepositoryWorkspacePage from "@/pages/app/RepositoryWorkspacePage"
import SummaryDetailsPage from "@/pages/app/SummaryDetailsPage"
import NotFoundPage from "@/pages/errors/NotFoundPage"
import LandingPage from "@/pages/public/LandingPage"
import RoleSelectionPage from "@/pages/public/RoleSelectionPage"
import SignInPage from "@/pages/public/SignInPage"
import SignUpPage from "@/pages/public/SignUpPage"

function App() {
  return (
    <BrowserRouter>
      <ReNoteClerkProvider>
        <TooltipProvider>
          <Routes>
            <Route path="sign-in/*" element={<SignInPage />} />
            <Route path="sign-up/*" element={<SignUpPage />} />

            <Route element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="role-selection" element={<RoleSelectionPage />} />
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
              <Route path="archive" element={<ArchiveTrashPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="design-system" element={<DesignSystemPage />} />
              <Route path="files/:fileId" element={<FilePreviewPage />} />
              <Route path="my-repositories" element={<MyRepositoriesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="summaries/:summaryId"
                element={<SummaryDetailsPage />}
              />
              <Route
                path="workspace/:repositoryId"
                element={<RepositoryWorkspacePage />}
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </ReNoteClerkProvider>
    </BrowserRouter>
  )
}

export default App
