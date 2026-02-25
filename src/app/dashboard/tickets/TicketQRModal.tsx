import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TicketQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export default function TicketQRModal({ isOpen, onClose, ticket }: TicketQRModalProps) {
  if (!isOpen || !ticket) return null;

  // Generate QR Value (e.g., a verify URL or just the ID)
  // Ideally: https://app.com/verify/TICKET_ID
  const qrValue = JSON.stringify({
      id: ticket.id,
      event_id: ticket.event?.id,
      ticket_type_id: ticket.ticket?.id,
      buyer: ticket.purchase_info?.buyer_name
  }); 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground bg-muted/50 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Ticket QR Code</h2>
            <p className="text-sm text-muted-foreground mb-8">
                Scan this code at the venue entrance.
            </p>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
                <QRCodeSVG value={qrValue} size={200} />
            </div>

            <div className="mt-8 pt-6 border-t border-border w-full">
                 <div className="flex justify-between text-sm mb-2">
                     <span className="text-muted-foreground">Event</span>
                     <span className="font-medium text-foreground">{ticket.event?.title}</span>
                 </div>
                 <div className="flex justify-between text-sm mb-2">
                     <span className="text-muted-foreground">Type</span>
                     <span className="font-medium text-foreground">{ticket.ticket?.title}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Ticket ID</span>
                     <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{ticket.id}</span>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
