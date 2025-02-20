import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TicketMessageList } from "./TicketMessageList"
import { TicketReplyForm } from "./TicketReplyForm"
import { TicketMetadata } from "./TicketMetadata"
import { Ticket } from "@/types/tickets"
import { useTicketOperations } from "@/hooks/useTicketOperations"
import { useState, useEffect } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketDetailsModalProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  canReply: boolean
}

export function TicketDetailsModal({ ticket, open, onOpenChange, canReply }: TicketDetailsModalProps) {
  const [reply, setReply] = useState("")
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  
  useEffect(() => {
    console.log("TicketDetailsModal - Props changed", { ticket, open })
  }, [ticket, open])

  const {
    isSubmitting,
    handleReply,
    updateStatus,
    updatePriority,
    updateProject,
  } = useTicketOperations(ticket?.id || '')
  
  console.log("TicketDetailsModal - After useTicketOperations", { 
    ticketId: ticket?.id,
    isSubmitting 
  })

  // Fetch available projects
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      console.log("TicketDetailsModal - Fetching projects")
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, code")
        .order("name")
      
      if (error) {
        console.error("TicketDetailsModal - Error fetching projects:", error)
        throw error
      }
      console.log("TicketDetailsModal - Projects fetched:", data)
      return data
    },
    enabled: open && !!ticket
  })

  const handleSubmitReply = async (isInternal: boolean = false) => {
    console.log("TicketDetailsModal - Attempting to submit reply", {
      replyLength: reply.length,
      isInternal,
      ticketExists: !!ticket
    })
    
    if (!reply.trim() || !ticket) {
      console.log("TicketDetailsModal - Reply submission cancelled", {
        emptyReply: !reply.trim(),
        noTicket: !ticket
      })
      return
    }
    
    const success = await handleReply(reply, isInternal)
    console.log("TicketDetailsModal - Reply submission result:", { success })
    
    if (success) {
      setReply("")
    }
  }

  // Return null after hooks are called
  if (!open || !ticket) {
    console.log("TicketDetailsModal - Early return", { open, hasTicket: !!ticket })
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogDescription>
            View and manage ticket information
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 space-y-4 overflow-hidden">
          <Collapsible
            open={!isMessagesOpen}
            onOpenChange={(open) => setIsMessagesOpen(!open)}
          >
            <CollapsibleContent className="space-y-4">
              <TicketMetadata
                ticket={ticket}
                projects={projects}
                onStatusChange={updateStatus}
                onPriorityChange={updatePriority}
                onProjectChange={updateProject}
              />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={isMessagesOpen}
            onOpenChange={setIsMessagesOpen}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <span className="text-sm font-medium">
                  {isMessagesOpen ? "Hide Messages" : "Show Messages"}
                </span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isMessagesOpen ? "transform rotate-180" : ""
                )} />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4">
              <div className="flex-1 overflow-y-auto">
                <TicketMessageList
                  ticketId={ticket.id}
                />
              </div>

              {canReply && (
                <TicketReplyForm
                  value={reply}
                  onChange={setReply}
                  onSubmit={handleSubmitReply}
                  isSubmitting={isSubmitting}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  )
}