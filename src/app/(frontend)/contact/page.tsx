import type { Metadata } from 'next'
import React from 'react'
import { ContactForm } from '@/components/ContactForm'
import { SocialLinks } from '@/components/SocialLinks'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { SiteSetting } from '@/payload-types'

export default async function ContactPage() {
  const siteSettings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting

  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Have a question, partnership inquiry, or want to get involved? Reach out to the Beyond AI
          team.
        </p>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

            {siteSettings?.contactEmail && (
              <div className="mb-4">
                <h3 className="font-medium mb-1">Email</h3>
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {siteSettings.contactEmail}
                </a>
              </div>
            )}

            {siteSettings?.contactPhone && (
              <div className="mb-4">
                <h3 className="font-medium mb-1">Phone</h3>
                <a
                  href={`tel:${siteSettings.contactPhone}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {siteSettings.contactPhone}
                </a>
              </div>
            )}

            {siteSettings?.address && (
              <div className="mb-6">
                <h3 className="font-medium mb-1">Address</h3>
                <p className="text-muted-foreground whitespace-pre-line">{siteSettings.address}</p>
              </div>
            )}

            {siteSettings?.socialLinks && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Follow Us</h3>
                <SocialLinks
                  twitter={siteSettings.socialLinks.twitter}
                  linkedin={siteSettings.socialLinks.linkedin}
                  instagram={siteSettings.socialLinks.instagram}
                  youtube={siteSettings.socialLinks.youtube}
                  facebook={siteSettings.socialLinks.facebook}
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Contact — Beyond AI',
  description:
    'Get in touch with the Beyond AI team. Send us a message about partnerships, events, or how to get involved.',
}
