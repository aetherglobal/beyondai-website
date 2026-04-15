import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/ContactForm'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { SiteSetting } from '@/payload-types'

export default async function BecomeSponsorPage() {
  const siteSettings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting

  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Become a Sponsor</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Partner with Beyond AI to support responsible AI governance and digital transformation in
          Africa.
        </p>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Sponsor?</h2>
            <p className="text-muted-foreground mb-6">
              By sponsoring Beyond AI, you become part of a growing movement shaping AI governance
              across Africa. Your support enables us to convene critical stakeholders, produce
              research, and amplify African voices in the global AI conversation.
            </p>

            <h3 className="text-lg font-semibold mb-3">Audience Reach</h3>
            <p className="text-muted-foreground mb-6">
              Our events and publications reach policymakers, technology leaders, academics,
              entrepreneurs, and civil society organizations across the continent and beyond.
            </p>

            <h3 className="text-lg font-semibold mb-3">Benefits for Sponsors</h3>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span>•</span>
                Brand visibility at AI Watch forums and Nyansa Futures conference
              </li>
              <li className="flex gap-2">
                <span>•</span>
                Logo placement on the Beyond AI website and publications
              </li>
              <li className="flex gap-2">
                <span>•</span>
                Speaking and engagement opportunities at events
              </li>
              <li className="flex gap-2">
                <span>•</span>
                Association with a credible AI governance initiative
              </li>
              <li className="flex gap-2">
                <span>•</span>
                Access to a network of policymakers, innovators, and researchers
              </li>
            </ul>

            {siteSettings?.contactEmail && (
              <p className="text-muted-foreground">
                You can also reach us directly at{' '}
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="text-foreground underline"
                >
                  {siteSettings.contactEmail}
                </a>
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Interested in sponsorship? Send us a message and we&apos;ll share our partnership
              options.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="container py-8 text-center">
        <Button asChild variant="outline">
          <Link href="/sponsors">View Current Sponsors & Partners</Link>
        </Button>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Become a Sponsor — Beyond AI',
  description:
    'Support the Beyond AI initiative. Learn about sponsorship benefits and partner with us to shape AI governance in Africa.',
}
