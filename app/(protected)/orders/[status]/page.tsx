
import { Clock, CheckCircle, XCircle } from "lucide-react"



export default function OrdersPage({ params }: any) {

  const statusIcons = {
    pending: Clock,
    completed: CheckCircle,
    failed: XCircle,
  }
  const StatusIcon = statusIcons[params.status as keyof typeof statusIcons]

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {params.status} Orders
      </h1>

      <div className="space-y-4">
        <div className="text-center py-8 bg-card rounded-lg">
          <StatusIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No {params.status} orders found</p>
        </div>
      </div>
    </div>
  )
} 