'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type CreateTaskState = { error?: string }

export async function createTask(
  _prevState: CreateTaskState,
  formData: FormData
): Promise<CreateTaskState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in.' }

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const budgetRaw = String(formData.get('budget') ?? '').trim()
  const budget = budgetRaw ? Number(budgetRaw) : null

  if (!title) return { error: 'Title is required.' }
  if (budgetRaw && Number.isNaN(budget)) return { error: 'Budget must be a number.' }

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({ requester_id: user.id, title, description, budget })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/browse')
  redirect(`/tasks/${task.id}`)
}
