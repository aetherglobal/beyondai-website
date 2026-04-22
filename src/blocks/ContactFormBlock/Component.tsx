import React from 'react'

import type { ContactFormBlockType } from '@/payload-types'
import { ContactForm } from '@/components/ContactForm'
import { SocialLinks } from '@/components/SocialLinks'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting } from '@/payload-types'

type Props = ContactFormBlockType & { disableInnerContainer?: boolean }

export const ContactFormBlockComponent: React.FC<Props> = async ({ eyebrow, heading, subheading }) => {
  const settings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting | null

  const headingLines = heading
    ? heading.split(/\r?\n/).filter((line: string) => line.length > 0)
    : []

  return (
    <section id="contact-form" className="bg-white">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            {eyebrow && (
              <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">{eyebrow}</p>
            )}
            {headingLines.length > 0 && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
                {headingLines.map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < headingLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
            )}
            <div className="w-16 h-0.5 bg-primary-deep mb-6" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Follow Us</p>
            <SocialLinks
              twitter={settings?.socialLinks?.twitter}
              linkedin={settings?.socialLinks?.linkedin}
              instagram={settings?.socialLinks?.instagram}
              youtube={settings?.socialLinks?.youtube}
              facebook={settings?.socialLinks?.facebook}
              className="mb-6"
            />
            {subheading && <p className="text-muted-foreground leading-relaxed">{subheading}</p>}
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
