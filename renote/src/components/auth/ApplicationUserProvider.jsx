import { useMemo, useState } from "react"
import { useUser } from "@clerk/clerk-react"

import { ApplicationUserContext } from "@/context/applicationUserContext"
import { readPrototypeRole, writePrototypeRole } from "@/lib/prototypeRoleStore"

function ApplicationUserProvider({ children }) {
  const { isLoaded, user } = useUser()
  const [selectedRole, setSelectedRole] = useState(null)
  const role = user
    ? selectedRole?.userId === user.id
      ? selectedRole.role
      : readPrototypeRole(user.id)
    : null

  // Clerk supplies identity. The role is a local demo fixture until a backend owns it.
  const appUser = useMemo(() => user && ({
    id: user.id,
    displayName: user.fullName ?? user.firstName ?? user.username ?? "ReNote User",
    email: user.primaryEmailAddress?.emailAddress ?? "",
    username: user.username ?? "",
    role,
  }), [role, user])

  function setPrototypeRole(nextRole) {
    if (!user) {
      throw new Error("Sign in before selecting a prototype role.")
    }

    writePrototypeRole(user.id, nextRole)
    setSelectedRole({ userId: user.id, role: nextRole })
  }

  return (
    <ApplicationUserContext.Provider value={{ appUser, isLoaded, setPrototypeRole }}>
      {children}
    </ApplicationUserContext.Provider>
  )
}

export default ApplicationUserProvider
