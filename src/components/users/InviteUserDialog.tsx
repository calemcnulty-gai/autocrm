import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const formSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "agent", "customer"]),
  teamId: z.string().uuid().optional(),
})

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "customer",
    },
  })

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name")

      if (error) throw error
      return data
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      console.log("Sending invitation:", values)

      // Send invitation via edge function
      const { error: emailError } = await supabase.functions.invoke(
        "send-invitation",
        {
          body: {
            email: values.email,
            role: values.role,
            teamId: values.teamId,
          },
        }
      )

      if (emailError) throw emailError

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${values.email}`,
      })

      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      console.error("Error sending invitation:", error)
      toast({
        variant: "destructive",
        title: "Error sending invitation",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new user to the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("role") !== "customer" && (
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams?.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Send Invitation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}