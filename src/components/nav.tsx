import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions'

export async function Nav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-black/[0.07] bg-[var(--background)]">
      <div className="mx-auto flex h-[60px] max-w-5xl items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-stone-900">
            TaskLoop
          </Link>
          <div className="hidden items-center gap-[22px] text-[13px] sm:flex">
            <Link href="/browse" className="text-stone-900">
              Browse
            </Link>
            {user && (
              <Link href="/dashboard" className="text-ink-faint transition-colors hover:text-stone-900">
                Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          {user ? (
            <>
              <Link href="/tasks/new" className="text-[13px] font-medium text-accent hover:text-accent-hover">
                Post a task
              </Link>
              <div className="h-7 w-7 rounded-full border border-black/[0.06] bg-stone-200" />
              <form action={signOut}>
                <button type="submit" className="text-[12.5px] text-ink-faint hover:text-stone-900">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[13px] text-ink-faint hover:text-stone-900">
                Sign in
              </Link>
              <Link href="/signup" className="text-[13px] font-medium text-accent hover:text-accent-hover">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
