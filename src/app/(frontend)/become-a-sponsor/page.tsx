import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Eye, Mic, Network, BookOpen, Users, Megaphone } from 'lucide-react'
import { FadeIn } from '@/components/FadeIn'
import { SponsorGrid } from '@/components/SponsorGrid'
import { SponsorInquiryForm } from '@/components/SponsorInquiryForm'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Sponsor, SiteSetting } from '@/payload-types'

const benefits = [
  {
    icon: Eye,
    title: 'Brand Visibility',
    description:
      'Logo placement across Beyond AI forums, the Nyansa Futures conference, publications, and our website.',
  },
  {
    icon: Mic,
    title: 'Speaking Opportunities',
    description: 'Engage as a thought leader at AI Watch forums and the Nyansa Futures conference.',
  },
  {
    icon: Network,
    title: 'Network Access',
    description:
      'Connect with policymakers, researchers, innovators, and civil society leaders across Africa.',
  },
  {
    icon: BookOpen,
    title: 'Research & Insights',
    description:
      'Early access to AI governance research, policy briefs, and curated intelligence from AI Pulse.',
  },
  {
    icon: Users,
    title: 'Community Alignment',
    description: 'Associate your brand with a credible, Africa-led AI governance initiative.',
  },
  {
    icon: Megaphone,
    title: 'Continental Reach',
    description:
      'Amplify your impact through our growing audience of decision-makers and technologists across the continent.',
  },
]

export default async function BecomeSponsorPage() {
  const payload = await getPayload({ config: configPromise })
  const siteSettings = (await getCachedGlobal('site-settings', 0)()) as SiteSetting

  const sponsorsResult = await payload.find({
    collection: 'sponsors',
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  })
  const allSponsors = sponsorsResult.docs as Sponsor[]

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
          <p className="text-sm tracking-widest uppercase text-primary mb-6">[Partnership]</p>

          <h1 className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-8">
            Become A Partner In
            <br />
            Shaping Africa&apos;s
            <br />
            <span className="text-primary">AI Future</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Join a growing coalition of organizations supporting responsible AI governance and
            digital transformation across the continent.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#inquiry-form"
              className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Partner With Us
            </a>
            <Link
              href="/sponsors"
              className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
            >
              View Current Partners
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <p className="text-sm tracking-widest uppercase text-primary mb-4">[Why Partner]</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-gray-900">
              Benefits Of Sponsorship
            </h2>
            <p className="text-gray-600 max-w-xl text-base leading-relaxed mb-12">
              Your support enables critical conversations, research, and advocacy that shape
              Africa&apos;s AI governance landscape.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <FadeIn key={benefit.title} delay={i * 0.08}>
                <div className="border-t-2 border-primary pt-6 h-full">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry-form" className="bg-dark py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="text-sm tracking-widest uppercase text-primary mb-4">[Get Started]</p>
                <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-4">
                  Start A<br />
                  Partnership
                </h2>
                <div className="w-16 h-0.5 bg-primary mb-6" />
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Tell us about your organization and how you would like to partner with Beyond AI.
                  Our team will respond within 2 business days with tailored partnership options.
                </p>
                {siteSettings?.contactEmail && (
                  <p className="text-muted-foreground text-sm">
                    Or email us directly at{' '}
                    <a
                      href={`mailto:${siteSettings.contactEmail}`}
                      className="text-primary underline hover:brightness-110 transition-all"
                    >
                      {siteSettings.contactEmail}
                    </a>
                  </p>
                )}
              </FadeIn>
            </div>

            <div className="lg:col-span-7">
              <FadeIn delay={0.1}>
                <SponsorInquiryForm />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Become a Sponsor',
  description:
    'Partner with Beyond AI to support responsible AI governance and digital transformation in Africa. Explore sponsorship benefits and submit an inquiry.',
}
