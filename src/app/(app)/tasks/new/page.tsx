import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewTaskForm } from './form'

export default async function NewTaskPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="mx-auto max-w-[620px] px-7 py-11">
      <h1 className="mb-2 text-2xl font-medium tracking-tight text-stone-900">Post a task</h1>
      <p className="mb-8 text-[13px] text-ink-faint">
        Describe it plainly. You can accept an offer as soon as one comes in.
      </p>
      <NewTaskForm />
    </div>
  )
}
