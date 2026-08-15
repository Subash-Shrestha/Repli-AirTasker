import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmptyState, StatusDot } from '@/components/ui'
import { formatMoney } from '@/lib/format'

type Row = { id: string; title: string; status: string; amount: number | null; dot: string }

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: posted }, { data: offeredOn }, { data: assigned }] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, title, status, budget, offers(count), profiles!assigned_provider_id(display_name)')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('offers')
      .select('id, amount, status, tasks(id, title)')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('tasks')
      .select('id, title, status, budget')
      .eq('assigned_provider_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const postedRows: Row[] = (posted ?? []).map((t) => {
    const assignee = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles
    const offerCount = t.offers?.[0]?.count ?? 0
    const status =
      t.status === 'open'
        ? `Open · ${offerCount} offer${offerCount === 1 ? '' : 's'}`
        : t.status === 'assigned'
          ? `Assigned to ${assignee?.display_name ?? 'provider'}`
          : 'Completed'
    return { id: t.id, title: t.title, status, amount: t.budget, dot: t.status }
  })

  const assignedRows: Row[] = (assigned ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status === 'completed' ? 'Completed' : 'In progress',
    amount: t.budget,
    dot: t.status,
  }))

  const offeredRows: Row[] = (offeredOn ?? [])
    .map((o) => {
      const task = Array.isArray(o.tasks) ? o.tasks[0] : o.tasks
      if (!task) return null
      return {
        id: task.id,
        title: task.title,
        status: o.status.replace(/_/g, ' '),
        amount: o.amount,
        dot: o.status,
      }
    })
    .filter((r): r is Row => r !== null)

  const postedCompleted = postedRows.filter((r) => r.dot === 'completed')
  const postedAccepted = postedRows.filter((r) => r.dot === 'completed' || r.dot === 'assigned')
  const spent = sum(postedCompleted.map((r) => r.amount))
  const avgAccepted = average(postedAccepted.map((r) => r.amount))

  const assignedCompleted = assignedRows.filter((r) => r.dot === 'completed')
  const earned = sum(assignedCompleted.map((r) => r.amount))
  const inProgressCount = assignedRows.filter((r) => r.dot !== 'completed').length
  const acceptedOffersCount = offeredRows.filter((r) => r.dot === 'accepted').length

  return (
    <div className="mx-auto max-w-3xl px-8 py-11">
      <h1 className="mb-10 text-[26px] font-medium tracking-tight text-stone-900">Your loop</h1>

      <div className="mb-12 grid grid-cols-1 gap-7 sm:grid-cols-2">
        <SummaryPanel
          role="As a poster"
          dotClassName="bg-accent"
          textClassName="text-accent"
          headline={formatMoney(spent)}
          headlineLabel="spent"
          headlineNote={`Across ${postedCompleted.length} completed task${postedCompleted.length === 1 ? '' : 's'}, all time.`}
          stats={[
            { value: String(postedRows.length), label: 'Tasks posted' },
            { value: String(postedRows.filter((r) => r.dot === 'open').length), label: 'Open' },
            { value: avgAccepted != null ? formatMoney(avgAccepted) : '—', label: 'Avg. accepted' },
          ]}
        />
        <SummaryPanel
          role="As a helper"
          dotClassName="bg-emerald-700"
          textClassName="text-emerald-700"
          headline={formatMoney(earned)}
          headlineLabel="earned"
          headlineNote={`Paid out on ${assignedCompleted.length} completed task${assignedCompleted.length === 1 ? '' : 's'}.`}
          stats={[
            { value: String(offeredRows.length), label: 'Offers sent' },
            { value: String(acceptedOffersCount), label: 'Accepted' },
            { value: String(inProgressCount), label: 'In progress' },
          ]}
        />
      </div>

      <Section title="Tasks you posted" count={postedRows.length} rows={postedRows} />
      <Section title="Assigned to you" count={assignedRows.length} rows={assignedRows} />
      <Section title="Your offers" count={offeredRows.length} rows={offeredRows} />
    </div>
  )
}

function sum(values: (number | null)[]) {
  return values.reduce<number>((total, v) => total + (v ?? 0), 0)
}

function average(values: (number | null)[]) {
  const nums = values.filter((v): v is number => v != null)
  if (nums.length === 0) return null
  return sum(nums) / nums.length
}

function SummaryPanel({
  role,
  dotClassName,
  textClassName,
  headline,
  headlineLabel,
  headlineNote,
  stats,
}: {
  role: string
  dotClassName: string
  textClassName: string
  headline: string
  headlineLabel: string
  headlineNote: string
  stats: { value: string; label: string }[]
}) {
  return (
    <div className="rounded-[9px] border border-black/[0.09] px-6.5 py-6">
      <div className="mb-5.5 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}`} />
        <span className={`font-mono text-[11px] font-medium tracking-wider uppercase ${textClassName}`}>
          {role}
        </span>
      </div>
      <div className="mb-1 flex items-baseline gap-2.5">
        <span className="text-[38px] leading-none font-medium tracking-tight text-stone-900">{headline}</span>
        <span className="text-[13px] text-ink-faint">{headlineLabel}</span>
      </div>
      <div className="mb-5.5 text-[12.5px] leading-tight text-stone-400">{headlineNote}</div>
      <div className="flex gap-8 border-t border-black/[0.07] pt-4.5">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="mb-1.5 text-[19px] leading-none font-medium text-stone-900">{s.value}</div>
            <div className="text-[11.5px] leading-tight text-ink-faint">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Section({ title, count, rows }: { title: string; count: number; rows: Row[] }) {
  return (
    <section className="mb-10">
      <div className="mb-3.5 flex items-baseline gap-2.5">
        <span className="text-[13px] font-medium text-stone-900">{title}</span>
        <span className="font-mono text-xs text-stone-400">{count}</span>
      </div>
      {rows.length === 0 ? (
        <EmptyState>Nothing yet.</EmptyState>
      ) : (
        <div className="border-t border-black/[0.07]">
          {rows.map((row) => (
            <Link
              key={row.id}
              href={`/tasks/${row.id}`}
              className="flex items-center justify-between gap-8 border-b border-black/[0.07] py-4 hover:bg-black/[0.015]"
            >
              <div className="flex items-center gap-3">
                <StatusDot status={row.dot} />
                <span className="text-sm text-stone-900">{row.title}</span>
              </div>
              <div className="flex shrink-0 items-center gap-7">
                <span className="text-xs text-ink-faint capitalize">{row.status}</span>
                <span className="w-14 text-right text-sm font-medium text-stone-900">
                  {row.amount != null ? formatMoney(row.amount) : '—'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
