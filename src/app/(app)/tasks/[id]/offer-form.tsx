'use client'

import { useActionState } from 'react'
import { submitOffer, type OfferFormState } from './actions'
import { Button, ErrorText, Input, SuccessText } from '@/components/ui'

export function OfferForm({ taskId }: { taskId: string }) {
  const action = (state: OfferFormState, formData: FormData) => submitOffer(taskId, state, formData)
  const [state, formAction, pending] = useActionState(action, {})

  if (state?.success) {
    return <SuccessText>Offer submitted.</SuccessText>
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="relative w-[130px] shrink-0">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[13.5px] text-stone-400">
            $
          </span>
          <Input name="amount" type="number" step="0.01" min="0" placeholder="Amount" required className="pl-7" />
        </div>
        <Input name="message" type="text" placeholder="Short message (optional)" className="flex-1" />
        <Button type="submit" variant="secondary" disabled={pending} className="shrink-0">
          {pending ? 'Sending…' : 'Send'}
        </Button>
      </div>
      {state?.error && <ErrorText>{state.error}</ErrorText>}
    </form>
  )
}
