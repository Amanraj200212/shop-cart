import { SignUpButton } from "@clerk/nextjs"
import { Button } from "./ui/button"

const SignUp = () => {
  return (
    <SignUpButton mode="redirect">
      <Button 
        variant="default"
        className="text-sm font-semibold hover:text-darkColor hoverEffect"
      >
        Sign Up
      </Button>
    </SignUpButton>
  )
}

export default SignUp