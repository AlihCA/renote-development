import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import AppLayout from "@/layouts/AppLayout"
import PublicLayout from "@/layouts/PublicLayout"
import DashboardPage from "@/pages/app/DashboardPage"
import ExplorePage from "@/pages/app/ExplorePage"
import MyRepositoriesPage from "@/pages/app/MyRepositoriesPage"
import RepositoryDetailsPage from "@/pages/app/RepositoryDetailsPage"
import NotFoundPage from "@/pages/errors/NotFoundPage"
import HelpAboutPage from "@/pages/public/HelpAboutPage"
import LandingPage from "@/pages/public/LandingPage"
import PublicExplorePage from "@/pages/public/PublicExplorePage"
import RoleSelectionPage from "@/pages/public/RoleSelectionPage"

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="explore-public" element={<PublicExplorePage />} />
            <Route path="help" element={<HelpAboutPage />} />
            <Route path="role-selection" element={<RoleSelectionPage />} />
          </Route>

          <Route path="app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="my-repositories" element={<MyRepositoriesPage />} />
            <Route
              path="repositories/:repositoryId"
              element={<RepositoryDetailsPage />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
