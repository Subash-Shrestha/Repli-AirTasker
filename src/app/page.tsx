import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Reveal } from '@/components/reveal'
import { formatRelativeTime, formatMoney } from '@/lib/format'

const steps = [
  { n: '01', title: 'Post it', body: "Title, a few lines of context, and what you'd pay. That's the form." },
  { n: '02', title: 'Read offers', body: 'People name their price and say when they can do it.' },
  { n: '03', title: 'Accept one', body: "The task moves to assigned. Everyone else sees it's taken." },
  { n: '04', title: 'Mark done', body: 'Closed and filed on your dashboard. Loop complete.' },
]

const curvePath = 'M20 360 C 120 360, 120 60, 240 60 S 360 300, 440 240'

export default async function Home() {
  const supabase = await createClient()
  const [{ data: tasks }, { data: userData }] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, title, description, budget, status, created_at, offers(count)')
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])
  const user = userData.user

  return (
    <div style={{ minHeight: '100vh', background: '#FBFAF8', overflowX: 'hidden' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(251,250,248,.88)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0,0,0,.07)',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            height: 64,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
            <span style={{ font: '600 16px/1 Geist, sans-serif', color: '#1C1A17', letterSpacing: '-.01em' }}>
              TaskLoop
            </span>
            <div style={{ display: 'flex', gap: 24, font: '400 13.5px/1 Geist, sans-serif' }}>
              <a href="#how" style={{ color: '#78716C' }}>
                How it works
              </a>
              <a href="#tasks" style={{ color: '#78716C' }}>
                Browse tasks
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {user ? (
              <>
                <Link href="/dashboard" style={{ font: '400 13.5px/1 Geist, sans-serif', color: '#78716C' }}>
                  Dashboard
                </Link>
                <Link
                  href="/tasks/new"
                  style={{
                    font: '500 13.5px/1 Geist, sans-serif',
                    color: '#fff',
                    background: '#5A51D4',
                    padding: '11px 17px',
                    borderRadius: 6,
                  }}
                >
                  Post a task
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" style={{ font: '400 13.5px/1 Geist, sans-serif', color: '#78716C' }}>
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  style={{
                    font: '500 13.5px/1 Geist, sans-serif',
                    color: '#fff',
                    background: '#5A51D4',
                    padding: '11px 17px',
                    borderRadius: 6,
                  }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          position: 'relative',
          maxWidth: 1120,
          margin: '0 auto',
          padding: '96px 40px 88px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <Reveal mode="in-left" delay={0} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A51D4' }} />
            <span
              style={{
                font: "500 11px/1 'Geist Mono', ui-monospace, monospace",
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: '#5A51D4',
              }}
            >
              Post · Offer · Accept · Done
            </span>
          </Reveal>
          <Reveal
            mode="in-left"
            delay={90}
            style={{
              margin: '0 0 20px',
              font: '500 54px/1.08 Geist, sans-serif',
              letterSpacing: '-.035em',
              color: '#1C1A17',
              textWrap: 'balance',
            }}
          >
            <h1 style={{ margin: 0, font: 'inherit', letterSpacing: 'inherit', color: 'inherit' }}>
              Small jobs, closed neatly.
            </h1>
          </Reveal>
          <Reveal
            mode="in-left"
            delay={170}
            style={{
              margin: '0 0 34px',
              maxWidth: 420,
              font: '400 16px/1.65 Geist, sans-serif',
              color: '#57534E',
              textWrap: 'pretty',
            }}
          >
            Post what needs doing, read the offers that come back, pick the one you like. One account does both
            sides.
          </Reveal>
          <Reveal mode="in-left" delay={250} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Link
              href="/tasks/new"
              style={{
                font: '500 14px/1 Geist, sans-serif',
                color: '#fff',
                background: '#5A51D4',
                padding: '14px 22px',
                borderRadius: 7,
              }}
            >
              Post a task
            </Link>
            <a
              href="#tasks"
              style={{
                font: '500 14px/1 Geist, sans-serif',
                color: '#1C1A17',
                border: '1px solid #1C1A17',
                padding: '13px 21px',
                borderRadius: 7,
              }}
            >
              Browse open tasks
            </a>
          </Reveal>
        </div>

        <Reveal mode="in-right" delay={220} style={{ position: 'relative', height: 420 }}>
          <div
            style={{
              position: 'absolute',
              inset: '-40px -160px -40px 0',
              background: '#F1EEE9',
              borderRadius: '220px 0 0 220px',
            }}
          />
          <svg viewBox="0 0 460 420" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <path
              d={curvePath}
              fill="none"
              stroke="#5A51D4"
              strokeWidth={1.5}
              strokeDasharray={1400}
              strokeDashoffset={1400}
              style={{ animation: 'drawCurve 2s cubic-bezier(.4,.1,.2,1) .35s forwards' }}
            />
            <circle
              r={5}
              fill="#5A51D4"
              style={{
                offsetPath: `path('${curvePath}')`,
                animation: 'loopDot 6s cubic-bezier(.5,0,.5,1) 2.2s infinite',
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 296,
              width: 224,
              background: '#FBFAF8',
              border: '1px solid rgba(0,0,0,.09)',
              borderRadius: 9,
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                font: "500 11px/1 'Geist Mono', monospace",
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: '#A8A29E',
                marginBottom: 9,
              }}
            >
              Posted
            </div>
            <div style={{ font: '500 14px/1.35 Geist, sans-serif', color: '#1C1A17' }}>
              Assemble a flat-pack wardrobe
            </div>
            <div style={{ marginTop: 8, font: '400 13px/1 Geist, sans-serif', color: '#78716C' }}>$120 · Newtown</div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 172,
              top: 12,
              width: 232,
              background: '#FBFAF8',
              border: '1px solid rgba(0,0,0,.09)',
              borderRadius: 9,
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                font: "500 11px/1 'Geist Mono', monospace",
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: '#A8A29E',
                marginBottom: 9,
              }}
            >
              Offer accepted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ font: '500 14px/1.35 Geist, sans-serif', color: '#1C1A17' }}>Sam K.</span>
              <span style={{ font: '500 14px/1 Geist, sans-serif', color: '#1C1A17' }}>$110</span>
            </div>
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                font: '500 12.5px/1 Geist, sans-serif',
                color: '#B45309',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B45309' }} />
              Assigned
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: -40,
              top: 214,
              width: 196,
              background: '#1C1A17',
              borderRadius: 9,
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                font: "500 11px/1 'Geist Mono', monospace",
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.45)',
                marginBottom: 9,
              }}
            >
              Marked done
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 13.5px/1 Geist, sans-serif', color: '#6EE7B7' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6EE7B7' }} />
              Completed
            </div>
          </div>
        </Reveal>
      </div>

      {/* CURVED BAND */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Reveal
          mode="in-curve"
          delay={0}
          style={{ background: '#F1EEE9', borderRadius: '0 320px 0 0', padding: '88px 0 96px', transformOrigin: 'left center' }}
        >
          <div id="how" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px' }}>
            <h2 style={{ margin: '0 0 8px', font: '500 30px/1.2 Geist, sans-serif', letterSpacing: '-.025em', color: '#1C1A17' }}>
              The whole loop
            </h2>
            <p style={{ margin: '0 0 48px', font: '400 14.5px/1.6 Geist, sans-serif', color: '#78716C' }}>
              Four steps, no detours.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36 }}>
              {steps.map((s) => (
                <div key={s.n} style={{ borderTop: '1px solid rgba(0,0,0,.14)', paddingTop: 18 }}>
                  <div style={{ font: "500 11.5px/1 'Geist Mono', ui-monospace, monospace", color: '#A8A29E', marginBottom: 14 }}>
                    {s.n}
                  </div>
                  <div style={{ font: '500 16px/1.3 Geist, sans-serif', color: '#1C1A17', marginBottom: 8 }}>{s.title}</div>
                  <div style={{ font: '400 13.5px/1.6 Geist, sans-serif', color: '#78716C', textWrap: 'pretty' }}>
                    {s.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* TASKS */}
      <div id="tasks" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 40px 40px' }}>
        <Reveal
          mode="in"
          delay={0}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}
        >
          <h2 style={{ margin: 0, font: '500 30px/1.2 Geist, sans-serif', letterSpacing: '-.025em', color: '#1C1A17' }}>
            Open right now
          </h2>
        </Reveal>
        <div style={{ borderTop: '1px solid rgba(0,0,0,.07)' }}>
          {!tasks || tasks.length === 0 ? (
            <div style={{ padding: '40px 0', font: '400 14px/1.6 Geist, sans-serif', color: '#78716C' }}>
              No open tasks yet — be the first to{' '}
              <Link href="/tasks/new" style={{ color: '#5A51D4', fontWeight: 500 }}>
                post one
              </Link>
              .
            </div>
          ) : (
            tasks.map((t, i) => {
              const offerCount = Array.isArray(t.offers) ? (t.offers[0]?.count ?? 0) : 0
              return (
                <Reveal key={t.id} mode="in-left" delay={i * 70}>
                  <Link
                    href={`/tasks/${t.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 40,
                      padding: '22px 0',
                      borderBottom: '1px solid rgba(0,0,0,.07)',
                    }}
                  >
                    <div style={{ maxWidth: 620 }}>
                      <div style={{ font: '500 15px/1.35 Geist, sans-serif', color: '#1C1A17', marginBottom: 5 }}>
                        {t.title}
                      </div>
                      {t.description && (
                        <div style={{ font: '400 13px/1.55 Geist, sans-serif', color: '#78716C', textWrap: 'pretty' }}>
                          {t.description}
                        </div>
                      )}
                      <div style={{ marginTop: 9, font: "400 11.5px/1 'Geist Mono', ui-monospace, monospace", color: '#A8A29E' }}>
                        {formatRelativeTime(t.created_at)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flex: 'none' }}>
                      <div style={{ font: '500 15px/1 Geist, sans-serif', color: '#1C1A17' }}>
                        {t.budget != null ? formatMoney(t.budget) : 'Open budget'}
                      </div>
                      <div style={{ marginTop: 7, font: '400 12px/1 Geist, sans-serif', color: '#8A837C' }}>
                        {offerCount === 0 ? 'No offers yet' : `${offerCount} offer${offerCount === 1 ? '' : 's'}`}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', overflow: 'hidden', marginTop: 72 }}>
        <Reveal
          mode="in-curve"
          delay={0}
          style={{ background: '#1C1A17', borderRadius: '200px 0 0 0', padding: '112px 0 104px', transformOrigin: 'right center' }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              padding: '0 40px 0 200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 48,
            }}
          >
            <div>
              <h2
                style={{
                  margin: '0 0 14px',
                  font: '500 36px/1.15 Geist, sans-serif',
                  letterSpacing: '-.03em',
                  color: '#FBFAF8',
                  maxWidth: 460,
                  textWrap: 'balance',
                }}
              >
                Something on your list since March?
              </h2>
              <p style={{ margin: 0, maxWidth: 400, font: '400 15px/1.6 Geist, sans-serif', color: 'rgba(251,250,248,.6)' }}>
                Post it in under a minute. Offers usually land the same day.
              </p>
            </div>
            <Link
              href="/tasks/new"
              style={{
                flex: 'none',
                font: '500 14px/1 Geist, sans-serif',
                color: '#1C1A17',
                background: '#FBFAF8',
                padding: '15px 24px',
                borderRadius: 7,
              }}
            >
              Post a task
            </Link>
          </div>
        </Reveal>
      </div>

      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '36px 40px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          font: '400 12.5px/1 Geist, sans-serif',
          color: '#A8A29E',
        }}
      >
        <span>TaskLoop — a practice project.</span>
        <div style={{ display: 'flex', gap: 22 }}>
          <a href="#how" style={{ color: '#A8A29E' }}>
            How it works
          </a>
          <a href="#tasks" style={{ color: '#A8A29E' }}>
            Browse
          </a>
        </div>
      </div>
    </div>
  )
}
