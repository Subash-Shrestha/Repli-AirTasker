'use client'

import { useTransition } from 'react'
import { acceptOffer } from './actions'
import { Button } from '@/components/ui'
import { formatMoney } from '@/lib/format'

type Offer = {
  id: string
  amount: number
  message: string
  status: string
  profiles: { display_name: string } | { display_name: string }[] | null
}

function providerName(profiles: Offer['profiles']) {
  if (!profiles) return 'Unknown'
  return Array.isArray(profiles) ? profiles[0]?.display_name : profiles.display_name
}

export function OfferRow({
  taskId,
  offer,
  canAccept,
}: {
  taskId: string
  offer: Offer
  canAccept: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center justify-between gap-6 border-b border-black/[0.07] py-[18px]">
      <div>
        <div className="mb-1 text-sm font-medium text-stone-900">
          {providerName(offer.profiles)}
          {offer.status !== 'active' && (
            <span className="ml-2 text-xs font-normal text-ink-faint capitalize">
              {offer.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        {offer.message && <div className="max-w-[380px] text-[13px] text-stone-500">{offer.message}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-5">
        <span className="text-[15px] font-medium text-stone-900">{formatMoney(offer.amount)}</span>
        {canAccept && (
          <Button
            onClick={() => startTransition(() => acceptOffer(taskId, offer.id))}
            disabled={isPending}
            className="px-4 py-2 text-[12.5px]"
          >
            {isPending ? 'Accepting…' : 'Accept'}
          </Button>
        )}
      </div>
    </div>
  )
}
