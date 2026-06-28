import { SignIn } from "@clerk/clerk-react"

import AuthLayout from "@/components/auth/AuthLayout"
import { renoteClerkAppearance } from "@/components/auth/clerkAppearance"

function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={renoteClerkAppearance}
        fallbackRedirectUrl="/role-selection"
        forceRedirectUrl="/role-selection"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AuthLayout>
  )
}

export default SignInPage
