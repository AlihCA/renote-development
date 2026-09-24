import { useContext } from "react"

import { ApplicationUserContext } from "@/context/applicationUserContext"

function useApplicationUser() {
  const context = useContext(ApplicationUserContext)

  if (!context) {
    throw new Error("useApplicationUser must be used inside ApplicationUserProvider.")
  }

  return context
}

export default useApplicationUser
