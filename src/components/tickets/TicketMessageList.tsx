import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { TicketMessage } from "./TicketMessage"

type Message = {
  id: string
  message: string
  created_at: string
  sender: {
    full_name: string
    role: string
  }
}

type TicketMessageListProps = {
  ticketId: string
}

export const TicketMessageList = ({ ticketId }: TicketMessageListProps) => {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["ticket-messages", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select(`
          id,
          message,
          created_at,
          sender:profiles!ticket_messages_sender_id_fkey (
            full_name,
            role
          )
        `)
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true })

      if (error) throw error
      
      // Transform the data to ensure sender is properly typed
      return (data as any[]).map(item => ({
        ...item,
        sender: {
          full_name: item.sender.full_name,
          role: item.sender.role
        }
      })) as Message[]
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center">No messages yet</p>
    )
  }

  const firstMessage = messages[0]
  const lastMessage = messages[messages.length - 1]
  const middleMessages = messages.slice(1, -1)

  return (
    <ScrollArea className="h-[300px] border rounded-md p-4">
      <div className="space-y-4">
        {/* First Message */}
        <div className="border-b pb-2">
          <TicketMessage {...firstMessage} />
        </div>

        {/* Middle Messages in Accordion */}
        {middleMessages.length > 0 && (
          <Accordion type="single" collapsible className="border rounded-md">
            <AccordionItem value="middle-messages">
              <AccordionTrigger className="px-4">
                {middleMessages.length} earlier message{middleMessages.length !== 1 ? 's' : ''}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-4">
                  {middleMessages.map((message) => (
                    <div key={message.id} className="border-b pb-2 last:border-0">
                      <TicketMessage {...message} />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Last Message */}
        {messages.length > 1 && (
          <div className="border-t pt-2">
            <TicketMessage {...lastMessage} />
          </div>
        )}
      </div>
    </ScrollArea>
  )
}