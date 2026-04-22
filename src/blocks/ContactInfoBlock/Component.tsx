import React from 'react'

import type { ContactInfoBlockType, SiteSetting } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

type Props = ContactInfoBlockType & { disableInnerContainer?: boolean }

export const ContactInfoBlockComponent: React.FC<Props> = async ({
  eyebrow,
  heading,
  subheading,
  showEmail = true,
  showPhone = true,
  showAddress = true,
}) => {
  const settings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting | null

  return (
    <section className="bg-white">
      <div className="container py-16 md:py-20">
        {(eyebrow || heading || subheading) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-4">
                {heading}
              </h2>
            )}
            {subheading && <p className="text-muted-foreground leading-relaxed">{subheading}</p>}
          </div>
        )}

        <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
          {showEmail && settings?.contactEmail && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</dt>
              <dd>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-primary-deep hover:underline"
                >
                  {settings.contactEmail}
                </a>
              </dd>
            </div>
          )}
          {showPhone && settings?.contactPhone && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Phone</dt>
              <dd>
                <a href={`tel:${settings.contactPhone}`} className="text-primary-deep hover:underline">
                  {settings.contactPhone}
                </a>
              </dd>
            </div>
          )}
          {showAddress && settings?.address && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Address</dt>
              <dd className="whitespace-pre-line text-foreground">{settings.address}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
