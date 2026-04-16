'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix?: string
  label: string
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

function AnimatedNumber({ value, suffix = '+' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const start = performance.now()

          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = easeOutQuart(progress)
            setDisplay(Math.round(eased * value))

            if (progress < 1) {
              requestAnimationFrame(tick)
            }
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export const AnimatedStats: React.FC<{ stats: Stat[]; className?: string; labelClassName?: string }> = ({ stats, className, labelClassName }) => {
  return (
    <section className={className ?? 'border-y border-primary/10'}>
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix ?? '+'} />
              </div>
              <div className={labelClassName ?? 'text-sm uppercase tracking-widest text-muted-foreground'}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
