import React from 'react'

import type { SplitContentBlock as SplitContentBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'

type Props = SplitContentBlockType & { disableInnerContainer?: boolean }

const backgroundClasses: Record<NonNullable<SplitContentBlockType['background']>, string> = {
  secondary: 'bg-secondary text-foreground',
  white: 'bg-white text-foreground',
  primary: 'bg-primary text-primary-foreground',
  dark: 'bg-dark text-dark-foreground',
}

export const SplitContentBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  image,
  imagePosition = 'right',
  background = 'white',
  links,
}) => {
  const imageRight = imagePosition !== 'left'
  const bg = backgroundClasses[background ?? 'white']
  const onColored = background === 'primary'
  const hasImage = image && typeof image !== 'number'

  return (
    <section className={`py-20 md:py-24 ${bg}`}>
      <div className="container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            imageRight ? '' : 'lg:[&>*:first-child]:order-2'
          }`}
        >
          <Reveal>
            <SectionHeader
              eyebrow={eyebrow}
              heading={heading}
              headingAccent={headingAccent}
              onColored={onColored}
              className="mb-6"
            />
            {body && (
              <div
                className={`text-base md:text-lg leading-relaxed mb-8 max-w-xl [&_p]:mb-4 last:[&_p]:mb-0 ${
                  onColored ? 'text-primary-foreground/85' : 'text-muted-foreground'
                }`}
              >
                <RichText data={body} enableGutter={false} />
              </div>
            )}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex flex-wrap gap-4">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={120}>
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
