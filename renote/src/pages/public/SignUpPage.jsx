import { SignUp } from "@clerk/clerk-react"

import AuthLayout from "@/components/auth/AuthLayout"
import { renoteClerkAppearance } from "@/components/auth/clerkAppearance"

function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        appearance={renoteClerkAppearance}
        fallbackRedirectUrl="/role-selection"
        forceRedirectUrl="/role-selection"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </AuthLayout>
  )
}

export default SignUpPage
