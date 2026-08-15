import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OfferForm } from './offer-form'
import { OfferRow } from './offer-row'
import { CompleteButton } from './complete-button'
import { EmptyState, StatusLabel } from '@/components/ui'
import { formatMoney, formatRelativeTime } from '@/lib/format'

export default async function TaskPage(props: PageProps<'/tasks/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: task } = await supabase
    .from('tasks')
    .select(
      'id, title, description, budget, status, requester_id, assigned_provider_id, created_at, profiles!requester_id(display_name)'
    )
    .eq('id', id)
    .single()

  if (!task) notFound()

  const requester = Array.isArray(task.profiles) ? task.profiles[0] : task.profiles

  const { data: offers } = await supabase
    .from('offers')
    .select('id, provider_id, amount, message, status, profiles(display_name)')
    .eq('task_id', id)
    .order('created_at', { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isRequester = user?.id === task.requester_id
  const isAssignedProvider = user?.id === task.assigned_provider_id
  const hasOffered = offers?.some((o) => o.provider_id === user?.id)

  return (
    <div className="mx-auto max-w-2xl px-8 py-11">
      <div className="mb-3">
        <StatusLabel status={task.status} />
      </div>
      <h1 className="mb-3.5 max-w-[540px] text-[27px] leading-tight font-medium tracking-tight text-stone-900">
        {task.title}
      </h1>
      {task.description && (
        <p className="mb-6 max-w-[560px] text-[14px] leading-relaxed text-stone-600">{task.description}</p>
      )}

      <div className="mb-9 flex gap-12 border-t border-b border-black/[0.07] py-5">
        {task.budget != null && (
          <div>
            <div className="mb-1.5 text-[11.5px] text-stone-400">Budget</div>
            <div className="text-base font-medium text-stone-900">{formatMoney(task.budget)}</div>
          </div>
        )}
        <div>
          <div className="mb-1.5 text-[11.5px] text-stone-400">Posted by</div>
          <div className="text-base font-medium text-stone-900">{requester?.display_name ?? 'Unknown'}</div>
        </div>
        <div>
          <div className="mb-1.5 text-[11.5px] text-stone-400">Posted</div>
          <div className="text-base font-medium text-stone-900">{formatRelativeTime(task.created_at)}</div>
        </div>
      </div>

      {(isRequester || isAssignedProvider) && task.status === 'assigned' && (
        <div className="mb-9">
          <CompleteButton taskId={task.id} />
        </div>
      )}

      <div className="mb-1 text-[13px] font-medium text-stone-900">Offers</div>
      <div className="mb-4 text-[12.5px] text-stone-400">
        {offers?.length ? `${offers.length} received` : 'None yet'}
      </div>
      {!offers || offers.length === 0 ? (
        <EmptyState>No offers yet.</EmptyState>
      ) : (
        <div className="mb-9 border-t border-black/[0.07]">
          {offers.map((offer) => (
            <OfferRow
              key={offer.id}
              taskId={task.id}
              offer={offer}
              canAccept={isRequester && task.status === 'open' && offer.status === 'active'}
            />
          ))}
        </div>
      )}

      {user && !isRequester && !hasOffered && task.status === 'open' && (
        <div>
          <div className="mb-4 text-[13px] font-medium text-stone-900">Make an offer</div>
          <OfferForm taskId={task.id} />
        </div>
      )}
    </div>
  )
}
