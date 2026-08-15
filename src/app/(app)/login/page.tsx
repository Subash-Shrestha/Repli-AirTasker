'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signIn, type LoginFormState } from './actions'
import { Button, ErrorText, Input } from '@/components/ui'

const initialState: LoginFormState = {}

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initialState)

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-[420px] flex-col justify-center px-11">
      <span className="mb-11 text-[15px] font-semibold tracking-tight text-stone-900">TaskLoop</span>
      <h1 className="mb-1.5 text-[22px] font-medium tracking-tight text-stone-900">Sign in</h1>
      <p className="mb-7 text-[13px] text-ink-faint">Pick up where the loop left off.</p>

      <form action={action} className="flex flex-col gap-3">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>
        {state.error && <ErrorText>{state.error}</ErrorText>}
      </form>

      <p className="mt-5 text-[13px] text-ink-faint">
        No account?{' '}
        <Link href="/signup" className="text-accent hover:text-accent-hover">
          Sign up
        </Link>
      </p>
    </div>
  )
}
