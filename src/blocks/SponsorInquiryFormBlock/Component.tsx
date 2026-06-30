import React from 'react'

import type { SponsorInquiryFormBlockType } from '@/payload-types'
import { SponsorInquiryForm } from '@/components/SponsorInquiryForm'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'

type Props = SponsorInquiryFormBlockType & { disableInnerContainer?: boolean }

const STEPS = [
  { title: 'Share your goals', body: 'Tell us your objectives and the audience you want to reach.' },
  { title: 'We shape a package', body: 'We tailor visibility, speaking, and activation to fit.' },
  { title: 'Partner & activate', body: 'Confirm, and we onboard you ahead of the convening.' },
]

export const SponsorInquiryFormBlockComponent: React.FC<Props> = ({
  eyebrow,
  heading,
  subheading,
  contactEmail,
}) => {
  return (
    <section id="sponsor-form" className="bg-secondary scroll-mt-24">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <Reveal>
            <SectionHeader
              eyebrow={eyebrow}
              heading={heading}
              subheading={subheading}
              className="mb-8"
            />

            <ol className="space-y-5">
              {STEPS.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-sm font-semibold text-primary-deep tabular-nums pt-0.5">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                We respond within <span className="text-foreground font-medium">2 business days</span>.
              </p>
              {contactEmail && (
                <p className="text-sm text-muted-foreground mt-2">
                  Prefer email?{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-medium text-primary-deep underline underline-offset-4 hover:no-underline"
                  >
                    {contactEmail}
                  </a>
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-white border border-border p-6 md:p-8">
              <SponsorInquiryForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
