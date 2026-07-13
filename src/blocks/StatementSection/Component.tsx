import React from 'react'
import Link from 'next/link'
import { ChevronsRight } from 'lucide-react'

import type {
  StatementSectionBlock as StatementSectionBlockType,
  Media as MediaDoc,
} from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Reveal } from '@/components/Reveal'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'

type Props = StatementSectionBlockType & { disableInnerContainer?: boolean }

const backgroundClasses: Record<NonNullable<StatementSectionBlockType['background']>, string> = {
  secondary: 'bg-secondary text-foreground',
  white: 'bg-white text-foreground',
  primary: 'bg-primary text-primary-foreground',
  dark: 'bg-dark text-dark-foreground',
}

const renderHeadingWithBreaks = (value: string): React.ReactNode =>
  value.split(/\r?\n/).map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ))

const CollageCell: React.FC<{
  resource?: (number | null) | MediaDoc
  className?: string
}> = ({ resource, className }) => (
  <div className={`relative overflow-hidden ${className ?? ''}`}>
    {resource && typeof resource !== 'number' ? (
      <Media resource={resource} fill imgClassName="object-cover" />
    ) : (
      <div
        className="absolute inset-0 flex items-center justify-center border border-primary-deep/15"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 35%, oklch(82% 0.17 85 / 0.18) 0%, oklch(96.5% 0.005 260) 70%)',
        }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-primary-deep/60 font-mono">
          Beyond AI
        </span>
      </div>
    )}
  </div>
)

export const StatementSectionBlock: React.FC<Props> = ({
  layout,
  eyebrow,
  heading,
  sideCta,
  subheading,
  body,
  showIcon,
  image,
  collageImages,
  background = 'secondary',
}) => {
  const bg = backgroundClasses[background ?? 'secondary']
  const sideCtaLink = sideCta?.link
  const sideCtaHref = sideCtaLink ? resolveLinkHref(sideCtaLink) : '#'
  const sideCtaLabel = sideCtaLink?.label
  const hasSideCta = Boolean(sideCtaLabel) && sideCtaHref !== '#'

  const sideCtaClassName =
    'inline-flex items-center px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-primary hover:border-primary-deep hover:text-primary-foreground transition-colors'

  if (layout === 'collage') {
    return (
      <section className={bg}>
        <div className="container py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.1] text-foreground">
                {renderHeadingWithBreaks(heading)}
              </h2>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              {showIcon !== false && (
                <div className="mb-6">
                  <ChevronsRight className="w-10 h-10 text-primary-deep" strokeWidth={1} />
                </div>
              )}
              {subheading && (
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4 text-foreground">
                  {subheading}
                </h3>
              )}
              {body && (
                <div className="text-secondary-foreground/70 leading-relaxed [&_p]:mb-4 last:[&_p]:mb-0">
                  <RichText data={body} enableGutter={false} />
                </div>
              )}
              {hasSideCta && (
                <div className="mt-8">
                  <Link
                    href={sideCtaHref}
                    {...(sideCtaLink?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                    className={sideCtaClassName}
                  >
                    {sideCtaLabel}
                  </Link>
                </div>
              )}
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 aspect-[3/2]">
                <CollageCell resource={collageImages?.main} className="row-span-2" />
                <CollageCell resource={collageImages?.topRight} />
                <CollageCell resource={collageImages?.bottomRight} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={bg}>
      <div className="container py-16 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.1] text-foreground">
                {renderHeadingWithBreaks(heading)}
              </h2>
            )}
          </div>
          {hasSideCta && (
            <div className="shrink-0">
              <Link
                href={sideCtaHref}
                {...(sideCtaLink?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                className={sideCtaClassName}
              >
                {sideCtaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="container lg:max-w-none p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          {showIcon !== false && (
            <div className="mb-6">
              <ChevronsRight className="w-10 h-10 text-primary-deep" strokeWidth={1} />
            </div>
          )}
          {subheading && (
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4 text-foreground">
              {subheading}
            </h3>
          )}
          {body && (
            <div className="text-secondary-foreground/70 leading-relaxed [&_p]:mb-4 last:[&_p]:mb-0">
              <RichText data={body} enableGutter={false} />
            </div>
          )}
        </div>

        <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden">
          {image && typeof image !== 'number' ? (
            <Media resource={image} fill imgClassName="object-cover" />
          ) : (
            <div className="text-gray-300 text-sm tracking-widest uppercase">Beyond AI</div>
          )}
        </div>
      </div>
    </section>
  )
}
