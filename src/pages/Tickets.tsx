import { MainLayout } from "@/components/layout/MainLayout"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { CreateTicketModal } from "@/components/tickets/CreateTicketModal"
import { TicketTable } from "@/components/tickets/TicketTable"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Ticket } from "@/types/tickets"

const Tickets = () => {
  const [searchParams] = useSearchParams()
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  // Get ticketId from URL params on mount
  useEffect(() => {
    const ticketId = searchParams.get('ticketId')
    if (ticketId) {
      setSelectedTicketId(ticketId)
    }
  }, [searchParams])

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          customer:profiles!tickets_customer_id_fkey(full_name, role, email),
          assignee:profiles!tickets_assigned_to_fkey(id, full_name),
          messages:ticket_messages(
            id,
            message,
            created_at,
            sender:profiles!ticket_messages_sender_id_fkey(full_name, role)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const isAgent = tickets?.[0]?.customer?.role === 'agent'
  const isAdmin = tickets?.[0]?.customer?.role === 'admin'
  const canEdit = isAgent || isAdmin

  // Find the selected ticket from the tickets array
  const selectedTicket = tickets?.find(ticket => ticket.id === selectedTicketId) || null

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tickets</h1>
          <CreateTicketModal />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <TicketTable 
            tickets={tickets} 
            isLoading={isLoading}
            canEdit={canEdit}
            selectedTicket={selectedTicket}
            onTicketSelect={setSelectedTicketId}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default Tickets