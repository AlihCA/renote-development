import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import ReNoteClerkProvider from "@/components/auth/ReNoteClerkProvider"
import AppLayout from "@/layouts/AppLayout"
import PublicLayout from "@/layouts/PublicLayout"
import AccessRequestsPage from "@/pages/app/AccessRequestsPage"
import ArchiveTrashPage from "@/pages/app/ArchiveTrashPage"
import CollectionDetailsPage from "@/pages/app/CollectionDetailsPage"
import CollectionsPage from "@/pages/app/CollectionsPage"
import DesignSystemPage from "@/pages/app/DesignSystemPage"
import DashboardPage from "@/pages/app/DashboardPage"
import ExplorePage from "@/pages/app/ExplorePage"
import FilePreviewPage from "@/pages/app/FilePreviewPage"
import MyRepositoriesPage from "@/pages/app/MyRepositoriesPage"
import NotificationsPage from "@/pages/app/NotificationsPage"
import ProfilePage from "@/pages/app/ProfilePage"
import RepositoryDetailsPage from "@/pages/app/RepositoryDetailsPage"
import RepositoryWorkspacePage from "@/pages/app/RepositoryWorkspacePage"
import SummaryDetailsPage from "@/pages/app/SummaryDetailsPage"
import SummaryHistoryPage from "@/pages/app/SummaryHistoryPage"
import NotFoundPage from "@/pages/errors/NotFoundPage"
import HelpAboutPage from "@/pages/public/HelpAboutPage"
import LandingPage from "@/pages/public/LandingPage"
import PublicExplorePage from "@/pages/public/PublicExplorePage"
import PublicFilePreviewPage from "@/pages/public/PublicFilePreviewPage"
import PublicRepositoryPreviewPage from "@/pages/public/PublicRepositoryPreviewPage"
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
              <Route path="explore-public" element={<PublicExplorePage />} />
              <Route path="files/:fileId" element={<PublicFilePreviewPage />} />
              <Route path="help" element={<HelpAboutPage />} />
              <Route
                path="repositories/:repositoryId"
                element={<PublicRepositoryPreviewPage />}
              />
              <Route path="role-selection" element={<RoleSelectionPage />} />
            </Route>

            <Route
              path="dashboard"
              element={<Navigate to="/app/dashboard" replace />}
            />
            <Route
              path="explore"
              element={<Navigate to="/app/explore" replace />}
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
              <Route path="access-requests" element={<AccessRequestsPage />} />
              <Route path="archive" element={<ArchiveTrashPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route
                path="collections/:collectionId"
                element={<CollectionDetailsPage />}
              />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="design-system" element={<DesignSystemPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="files/:fileId" element={<FilePreviewPage />} />
              <Route path="my-repositories" element={<MyRepositoriesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="repositories/:repositoryId"
                element={<RepositoryDetailsPage />}
              />
              <Route path="summaries" element={<SummaryHistoryPage />} />
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
