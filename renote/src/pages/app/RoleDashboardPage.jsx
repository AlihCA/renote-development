import useApplicationUser from "@/hooks/useApplicationUser"
import { APP_ROLES } from "@/lib/roles"
import AdminDashboardPage from "@/pages/app/AdminDashboardPage"
import DashboardPage from "@/pages/app/DashboardPage"
import FacultyDashboardPage from "@/pages/app/FacultyDashboardPage"

const dashboards = {
  [APP_ROLES.STUDENT]: DashboardPage,
  [APP_ROLES.FACULTY]: FacultyDashboardPage,
  [APP_ROLES.ADMIN]: AdminDashboardPage,
}

function RoleDashboardPage() {
  const { appUser } = useApplicationUser()
  const Dashboard = dashboards[appUser?.role] ?? DashboardPage

  return <Dashboard />
}

export default RoleDashboardPage
