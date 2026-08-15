'use client'

import { useTransition } from 'react'
import { markComplete } from './actions'
import { Button } from '@/components/ui'

export function CompleteButton({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button onClick={() => startTransition(() => markComplete(taskId))} disabled={isPending}>
      {isPending ? 'Marking complete…' : 'Mark complete'}
    </Button>
  )
}
