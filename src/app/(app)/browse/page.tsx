import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui'
import { formatMoney, formatRelativeTime } from '@/lib/format'

export default async function Home() {
  const supabase = await createClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, description, budget, created_at, offers(count)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-8 py-11">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h1 className="mb-1.5 text-[26px] leading-tight font-medium tracking-tight text-stone-900">
            Open tasks
          </h1>
          <p className="text-[13px] text-ink-faint">
            {tasks?.length ?? 0} task{tasks?.length === 1 ? '' : 's'} waiting on an offer
          </p>
        </div>
        <div className="flex gap-4.5 text-[12.5px] text-ink-faint">
          <span className="border-b border-stone-900 pb-1 text-stone-900">Newest</span>
          <span className="pb-1">Budget</span>
        </div>
      </div>

      {!tasks || tasks.length === 0 ? (
        <EmptyState>
          No open tasks yet — be the first to{' '}
          <Link href="/tasks/new" className="font-medium text-accent hover:underline">
            post one
          </Link>
          .
        </EmptyState>
      ) : (
        <div className="border-t border-black/[0.07]">
          {tasks.map((task) => {
            const offerCount = task.offers?.[0]?.count ?? 0
            return (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-start justify-between gap-10 border-b border-black/[0.07] py-[22px] hover:bg-black/[0.015]"
              >
                <div className="max-w-[600px]">
                  <div className="mb-1 text-[15px] font-medium text-stone-900">{task.title}</div>
                  {task.description && (
                    <div className="line-clamp-2 text-[13px] text-stone-500">{task.description}</div>
                  )}
                  <div className="mt-2 font-mono text-[11.5px] text-stone-400">
                    {formatRelativeTime(task.created_at)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {task.budget != null && (
                    <div className="text-[15px] font-medium text-stone-900">{formatMoney(task.budget)}</div>
                  )}
                  <div className="mt-[7px] text-xs text-ink-faint">
                    {offerCount === 0 ? 'No offers yet' : `${offerCount} offer${offerCount === 1 ? '' : 's'}`}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
