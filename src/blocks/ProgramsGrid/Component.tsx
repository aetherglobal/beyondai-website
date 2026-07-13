import React from 'react'

import type { ProgramsGridBlock as ProgramsGridBlockType } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'
import { Media } from '@/components/Media'

type Props = ProgramsGridBlockType & { disableInnerContainer?: boolean }

type ProgramItem = NonNullable<ProgramsGridBlockType['items']>[number]

const ShowcaseMedia: React.FC<{ image: ProgramItem['image'] }> = ({ image }) => {
  const hasImage = image && typeof image !== 'number'
  return (
    <div className="relative aspect-4/3 overflow-hidden">
      {hasImage ? (
        <Media resource={image} fill imgClassName="object-cover" />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center border border-primary-deep/15"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 35%, oklch(82% 0.17 85 / 0.18) 0%, oklch(96.5% 0.005 260) 70%)',
          }}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary-deep/60 font-mono">
            Beyond AI
          </span>
        </div>
      )}
    </div>
  )
}

const columnClassMap: Record<string, string> = {
  '1': 'md:grid-cols-1',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

const backgroundClassMap: Record<string, string> = {
  primary: 'bg-primary',
  white: 'bg-white',
  secondary: 'bg-secondary',
  dark: 'bg-dark',
}

export const ProgramsGridBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  columns = '2',
  background = 'primary',
  layout = 'grid',
  items,
}) => {
  if (!items || items.length === 0) return null

  const bg = backgroundClassMap[background ?? 'primary']
  const isPrimary = background === 'primary'
  const isDark = background === 'dark'
  const onColored = isPrimary || isDark

  if (layout === 'showcase') {
    const accent = onColored ? 'text-primary-foreground/60' : 'text-primary-deep'
    const titleColor = onColored ? 'text-primary-foreground' : 'text-foreground'
    const descColor = onColored ? 'text-primary-foreground/70' : 'text-muted-foreground'
    const numberColor = onColored ? 'text-primary-foreground/50' : 'text-muted-foreground'
    const labelCls = `text-sm md:text-base font-bold ${accent}`

    return (
      <section className={`mt-16 py-20 md:py-24 ${bg}`}>
        <div className="container">
          <SectionHeader
            eyebrow={eyebrow}
            heading={heading}
            subheading={subheading}
            onColored={onColored}
            className="mb-16 max-w-2xl"
          />
          <div className="flex flex-col gap-24 md:gap-32">
            {items.map((item, i) => {
              const imageLeft = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16 ${
                    imageLeft ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <Reveal>
                    <p
                      className={`text-xl md:text-2xl font-normal tabular-nums ${numberColor}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3
                      className={`mt-4 md:mt-5 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${titleColor}`}
                    >
                      {item.title}
                    </h3>
                    <div className="mt-8 max-w-xl">
                      <span className={labelCls}>Description:</span>
                      <p className={`mt-2 text-sm md:text-base leading-relaxed ${descColor}`}>
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={120}>
                    <ShowcaseMedia image={item.image} />
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  const cardBase = onColored
    ? 'bg-primary-foreground/5 border-l-2 border-transparent hover:border-primary-foreground hover:bg-primary-foreground/10'
    : 'bg-white border-l-2 border-transparent hover:border-primary-deep hover:bg-secondary'
  const gridDivider = onColored ? 'bg-primary-foreground/10' : 'bg-border'
  const headingColor = onColored ? 'text-primary-foreground' : 'text-foreground'
  const descriptionColor = onColored ? 'text-primary-foreground/70' : 'text-muted-foreground'

  return (
    <section className={`mt-16 py-20 md:py-24 ${bg}`}>
      <div className="container">
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
          onColored={onColored}
          className="mb-12 max-w-2xl"
        />
        <div className={`grid grid-cols-1 ${columnClassMap[columns ?? '2']} gap-px ${gridDivider}`}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 60} className="h-full">
              <div
                className={`group relative h-full p-8 transition-colors duration-300 ${cardBase}`}
              >
                <h3 className={`text-xl font-bold mb-3 tracking-tight ${headingColor}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${descriptionColor}`}>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
