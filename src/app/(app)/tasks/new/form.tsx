'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { createTask } from './actions'
import { Button, ErrorText, Field, Input, Textarea } from '@/components/ui'

export function NewTaskForm() {
  const [state, action, pending] = useActionState(createTask, {})

  return (
    <form action={action} className="flex flex-col gap-[22px]">
      <Field label="Title">
        <Input name="title" type="text" placeholder="What needs doing?" required />
      </Field>
      <Field label="Description">
        <Textarea
          name="description"
          placeholder="Where, when, and anything a helper should know."
          rows={4}
        />
      </Field>
      <Field label="Budget">
        <div className="relative w-[150px]">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[13.5px] text-stone-400">
            $
          </span>
          <Input name="budget" type="number" step="0.01" min="0" placeholder="0" className="pl-7" />
        </div>
      </Field>
      <div className="flex items-center gap-4 border-t border-black/[0.07] pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Posting…' : 'Post task'}
        </Button>
        <Link href="/browse" className="text-[13.5px] text-ink-faint hover:text-stone-900">
          Cancel
        </Link>
      </div>
      {state?.error && <ErrorText>{state.error}</ErrorText>}
    </form>
  )
}
