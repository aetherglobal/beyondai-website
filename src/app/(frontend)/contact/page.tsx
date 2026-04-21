import type { Metadata } from 'next'
import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { SocialLinks } from '@/components/SocialLinks'
import { FadeIn } from '@/components/FadeIn'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { SiteSetting } from '@/payload-types'

export default async function ContactPage() {
  const siteSettings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting

  return (
    <article>
      <section className="relative min-h-[70vh] bg-dark flex items-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, oklch(83.5% 0.16 165.7 / 0.07) 0%, transparent 70%)',
          }}
        />

        <div className="container relative z-10 py-20 md:py-28">
          <p className="text-sm tracking-widest uppercase text-primary-deep mb-6">[Contact]</p>

          <h1 className="text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-8">
            Let&apos;s Start A
            <br />
            <span className="text-primary-deep">Conversation</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Have a question, partnership inquiry, or want to get involved? Reach out to the Beyond AI
            team — we&apos;d love to hear from you.
          </p>

          <a
            href="#contact-form"
            className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
          >
            Send a Message
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <section id="contact-form" className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="text-sm tracking-widest uppercase text-primary-deep mb-4">
                  [Get In Touch]
                </p>
                <h2 className="text-3xl text-gray-900 md:text-4xl font-bold uppercase tracking-tight mb-4">
                  Reach Out
                  <br />
                  To Us
                </h2>
                <div className="w-16 h-0.5 bg-primary mb-8" />

                <div className="space-y-5">
                  {siteSettings?.contactEmail && (
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 text-primary-deep shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${siteSettings.contactEmail}`}
                          className="text-gray-900 hover:text-primary-deep transition-colors"
                        >
                          {siteSettings.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {siteSettings?.contactPhone && (
                    <div className="flex items-start gap-4">
                      <Phone className="w-5 h-5 text-primary-deep shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${siteSettings.contactPhone}`}
                          className="text-gray-900 hover:text-primary-deep transition-colors"
                        >
                          {siteSettings.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {siteSettings?.address && (
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-primary-deep shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                          Address
                        </p>
                        <p className="text-gray-900 whitespace-pre-line">{siteSettings.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {siteSettings?.socialLinks && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                      Follow Us
                    </p>
                    <SocialLinks
                      twitter={siteSettings.socialLinks.twitter}
                      linkedin={siteSettings.socialLinks.linkedin}
                      instagram={siteSettings.socialLinks.instagram}
                      youtube={siteSettings.socialLinks.youtube}
                      facebook={siteSettings.socialLinks.facebook}
                    />
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-8">
                  We typically respond within 48 hours.
                </p>
              </FadeIn>
            </div>

            <div className="lg:col-span-7">
              <FadeIn delay={0.1}>
                <ContactForm />
              </FadeIn>
            </div>
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
