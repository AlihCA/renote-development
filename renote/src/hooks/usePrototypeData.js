import { useContext } from "react"

import { PrototypeDataContext } from "@/context/prototypeDataContext"

function usePrototypeData() {
  const context = useContext(PrototypeDataContext)
  if (!context) throw new Error("usePrototypeData must be used inside PrototypeDataProvider.")
  return context
}

export default usePrototypeData
