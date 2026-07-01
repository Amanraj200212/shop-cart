import { Button } from "./ui/button"
import { SignInButton } from "@clerk/nextjs"

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <Button 
        variant="ghost"
        className="text-sm font-semibold hover:text-darkColor hoverEffect"
      >
        Login
      </Button>
    </SignInButton>
  )
}

export default SignIn;