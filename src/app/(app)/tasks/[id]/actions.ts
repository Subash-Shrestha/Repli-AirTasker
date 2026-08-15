'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type OfferFormState = { error?: string; success?: boolean }

export async function submitOffer(
  taskId: string,
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in.' }

  const amountRaw = String(formData.get('amount') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const amount = Number(amountRaw)
  if (!amountRaw || Number.isNaN(amount)) return { error: 'Enter a valid amount.' }

  const { error } = await supabase
    .from('offers')
    .insert({ task_id: taskId, provider_id: user.id, amount, message })

  if (error) return { error: error.message }

  revalidatePath(`/tasks/${taskId}`)
  return { success: true }
}

export async function acceptOffer(taskId: string, offerId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('accept_offer', {
    p_task_id: taskId,
    p_offer_id: offerId,
  })
  if (error) throw new Error(error.message)

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/browse')
}

export async function markComplete(taskId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId)
    .eq('status', 'assigned')

  if (error) throw new Error(error.message)

  revalidatePath(`/tasks/${taskId}`)
  revalidatePath('/dashboard')
}
