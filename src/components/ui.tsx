import { type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const buttonVariants = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
  ghost: 'text-ink-faint hover:text-stone-900',
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-md px-5 py-3 text-[13.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-md border border-black/[0.14] bg-white px-3.5 py-3 text-[13.5px] text-stone-900 placeholder:text-stone-400 outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/15',
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        'w-full rounded-md border border-black/[0.14] bg-white px-3.5 py-3 text-[13.5px] text-stone-900 placeholder:text-stone-400 outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/15',
        className
      )}
      {...props}
    />
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12.5px] font-medium text-stone-900">{label}</span>
      {children}
    </label>
  )
}

const dotColor: Record<string, string> = {
  open: 'bg-accent',
  assigned: 'bg-amber-700',
  completed: 'bg-emerald-700',
  active: 'bg-accent',
  accepted: 'bg-emerald-700',
  not_selected: 'bg-not-selected',
}

const dotLabelColor: Record<string, string> = {
  open: 'text-accent',
  assigned: 'text-amber-700',
  completed: 'text-emerald-700',
}

export function StatusDot({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cx('inline-block h-1.5 w-1.5 shrink-0 rounded-full', dotColor[status] ?? 'bg-stone-300', className)}
    />
  )
}

export function StatusLabel({ status }: { status: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-wider uppercase',
        dotLabelColor[status] ?? 'text-stone-500'
      )}
    >
      <StatusDot status={status} />
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-rose-600">{children}</p>
}

export function SuccessText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-emerald-700">{children}</p>
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-black/[0.07] px-0 py-10 text-center text-sm text-ink-faint">
      {children}
    </div>
  )
}
