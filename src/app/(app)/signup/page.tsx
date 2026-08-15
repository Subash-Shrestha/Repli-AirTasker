'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signUp } from '@/app/(app)/login/actions'
import type { LoginFormState } from '@/app/(app)/login/actions'
import { Button, ErrorText, Input, SuccessText } from '@/components/ui'

const initialState: LoginFormState = {}

export default function SignupPage() {
  const [state, action, pending] = useActionState(signUp, initialState)

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-[420px] flex-col justify-center px-11">
      <span className="mb-11 text-[15px] font-semibold tracking-tight text-stone-900">TaskLoop</span>
      <h1 className="mb-1.5 text-[22px] font-medium tracking-tight text-stone-900">Create an account</h1>
      <p className="mb-7 text-[13px] text-ink-faint">One account. Post tasks, take tasks.</p>

      <form action={action} className="flex flex-col gap-3">
        <Input name="displayName" type="text" placeholder="Name" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required minLength={6} />
        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? 'Creating…' : 'Create account'}
        </Button>
        {state.error && <ErrorText>{state.error}</ErrorText>}
        {state.message && <SuccessText>{state.message}</SuccessText>}
      </form>

      <p className="mt-5 text-[13px] text-ink-faint">
        Already have one?{' '}
        <Link href="/login" className="text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}
