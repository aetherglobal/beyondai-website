import React from 'react'

import type { SplitContentBlock as SplitContentBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

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

  return (
    <section className={`py-20 ${bg}`}>
      <div className="container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            imageRight ? '' : 'lg:[&>*:first-child]:order-2'
          }`}
        >
          <div>
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {(heading || headingAccent) && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-6 text-gray-900">
                {heading}
                {headingAccent && (
                  <>
                    {heading && <br />}
                    <span className="text-primary-deep">{headingAccent}</span>
                  </>
                )}
              </h2>
            )}
            {body && (
              <div className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg [&_p]:mb-4 last:[&_p]:mb-0">
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
          </div>
          <div className="relative aspect-4/3 bg-gray-100 flex items-center justify-center overflow-hidden">
            {image && typeof image !== 'number' ? (
              <Media resource={image} fill imgClassName="object-cover" />
            ) : (
              <div className="text-gray-300 text-sm tracking-widest uppercase">Beyond AI</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
