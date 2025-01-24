import { useNavigate, useLocation } from "react-router-dom"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch } from "@/store"
import { setSession } from "@/store/authSlice"

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const dispatch = useAppDispatch()

  // If user is already authenticated, redirect them
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    dispatch(setSession(session))
    navigate(from, { replace: true })
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account or create a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "rgb(var(--primary))",
                    brandAccent: "rgb(var(--primary))",
                  },
                },
              },
              className: {
                container: "space-y-4",
                button: "w-full",
              },
            }}
            providers={["google", "github"]}
            redirectTo={window.location.origin}
            magicLink={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}