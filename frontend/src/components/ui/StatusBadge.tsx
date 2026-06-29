import { RequestStatus } from '../../types'

const labels: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  APPROVED: 'Approved',
  DISAPPROVED: 'Disapproved',
  CANCELLED: 'Cancelled',
}

export default function StatusBadge({ status }: { status: string }) {
  const cls = `status-${status.toLowerCase()}`
  return <span className={cls}>{labels[status] || status}</span>
}
