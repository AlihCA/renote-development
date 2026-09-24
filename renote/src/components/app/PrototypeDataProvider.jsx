import { useReducer } from "react"

import { PrototypeDataContext } from "@/context/prototypeDataContext"
import { createPrototypeState, prototypeDataReducer } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"

function PrototypeDataSession({ appUser, children }) {
  const [state, dispatch] = useReducer(prototypeDataReducer, appUser, createPrototypeState)

  return (
    <PrototypeDataContext.Provider value={{ state, dispatch }}>
      {children}
    </PrototypeDataContext.Provider>
  )
}

function PrototypeDataProvider({ children }) {
  const { appUser } = useApplicationUser()

  if (!appUser) return children

  // Key by Clerk identity, not demo role: navigation and role switching share one session state.
  return (
    <PrototypeDataSession appUser={appUser} key={appUser.id}>
      {children}
    </PrototypeDataSession>
  )
}

export default PrototypeDataProvider
