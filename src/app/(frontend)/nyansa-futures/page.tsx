import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FAQ } from '@/components/FAQ'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { AnimatedStats } from '@/components/AnimatedStats'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FadeIn } from '@/components/FadeIn'

import type { NyansaFuture } from '@/payload-types'

const stats = [
  { value: 2, suffix: '', label: 'Days' },
  { value: 6, suffix: '+', label: 'Themes' },
  { value: 500, suffix: '+', label: 'Attendees' },
  { value: 10, suffix: '+', label: 'Countries' },
]

export default async function NyansaFuturesPage() {
  const data = (await getCachedGlobal('nyansa-futures', 1)()) as NyansaFuture

  const faqItems =
    data?.faq?.map((item) => ({
      question: item.question,
      answer: item.answer,
    })) || []

  const attendees = data?.whoShouldAttend?.split('\n').filter(Boolean) || []
  const formatBlocks = data?.format?.split('\n\n').filter(Boolean) || []

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
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary border border-primary/30">
              Two-Day Hybrid Conference
            </span>
            <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-white/60 border border-white/20">
              Kigali, Rwanda
            </span>
          </div>

          <p className="text-sm tracking-widest uppercase text-primary mb-6">
            [Flagship Conference]
          </p>

          <h1 className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-8">
            Africa&apos;s Premier
            <br />
            Conference On
            <br />
            <span className="text-primary">AI Governance</span>
          </h1>

          {data?.subheadline && (
            <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
              {data.subheadline}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {data?.attendUrl && (
              <a
                href={data.attendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
              >
                Register to Attend
              </a>
            )}
            <Link
              href={data?.sponsorUrl || '/become-a-sponsor'}
              className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
            >
              Become a Sponsor
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <AnimatedStats
        stats={stats}
        className="bg-white border-b border-gray-200"
        labelClassName="text-sm uppercase tracking-widest text-gray-500"
      />

      {data?.description && (
        <section className="bg-white py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-5">
                  {data?.heroImage && typeof data.heroImage !== 'number' ? (
                    <div className="relative aspect-4/5 border-t-2 border-primary overflow-hidden">
                      <Media resource={data.heroImage} fill imgClassName="object-cover" />
                    </div>
                  ) : (
                    <div className="relative aspect-4/5 bg-gray-100" />
                  )}
                </div>

                <div className="lg:col-span-7">
                  <p className="text-sm tracking-widest uppercase text-primary mb-4">[About]</p>
                  <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-4 text-gray-900">
                    What is Nyansa Futures?
                  </h2>
                  <div className="w-16 h-0.5 bg-primary mb-6" />
                  <div className="bg-white prose [&_p]:text-gray-700 [&_li]:text-gray-700 [&_h2]:text-gray-900 [&_h3]:text-gray-900">
                    <RichText data={data.description} enableGutter={false} />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {data?.whyItMatters && (
        <section className="bg-primary py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-sm tracking-widest uppercase text-primary-foreground mb-4">
                    [Purpose]
                  </p>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight text-primary-foreground">
                    Why It
                    <br />
                    Matters
                  </h2>
                </div>
                <div className="border-l-2 border-white/30 pl-6">
                  <div className="prose [&_p]:text-primary-foreground [&_li]:text-primary-foreground">
                    <RichText data={data.whyItMatters} enableGutter={false} />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {attendees.length > 0 && (
        <section className="bg-dark py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[Audience]</p>
              <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-12">
                Who Should Attend
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendees.map((item, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="group flex items-start gap-4 p-6 bg-card border-l-2 border-transparent hover:border-primary transition-all duration-300">
                    <span className="text-primary text-sm font-mono shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-white leading-relaxed">{item.trim()}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.format && (
        <section className="bg-white py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[Format]</p>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-12 text-gray-900">
                Conference Format
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formatBlocks.map((block, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="border-t-2 border-primary pt-6">
                    <span className="text-3xl font-bold text-primary font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-gray-700 leading-relaxed mt-3">{block.trim()}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.keyThemes && data.keyThemes.length > 0 && (
        <section className="bg-dark py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[Themes]</p>
              <h2 className="text-3xl text-white sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight mb-12">
                Key Themes
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.keyThemes.map((item, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="group relative p-8 md:p-10 bg-card border-t-2 border-transparent hover:border-primary transition-all duration-300">
                    <span className="text-4xl font-bold text-primary/40 group-hover:text-primary transition-colors font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-3 mb-2 tracking-tight">
                      {item.theme}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.expectedOutcomes && data.expectedOutcomes.length > 0 && (
        <section className="bg-primary py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl">
                <p className="text-sm tracking-widest uppercase text-primary-foreground mb-4">
                  [Outcomes]
                </p>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-primary-foreground mb-10">
                  Expected Outcomes
                </h2>
              </div>
            </FadeIn>
            <div className="max-w-3xl">
              {data.expectedOutcomes.map((item, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4 py-5 border-b border-white/10 last:border-b-0">
                    <ArrowRight className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
                    <p className="text-primary-foreground leading-relaxed">{item.outcome}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <p className="text-sm tracking-widest uppercase text-primary mb-4">[FAQ]</p>
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8 text-gray-900">
                  Frequently Asked Questions
                </h2>
                <FAQ
                  items={faqItems}
                  className="[&_button>span:first-child]:text-gray-900 [&_button>span:last-child]:text-gray-500 [&>div>div>div]:text-gray-600 divide-gray-200"
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="bg-dark py-16 md:py-20">
        <div className="container text-center max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-4">
              Be Part of Africa&apos;s AI Future
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Join policymakers, innovators, and thought leaders shaping responsible AI governance
              across the continent. Register now or partner with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {data?.attendUrl && (
                <a
                  href={data.attendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Register to Attend
                </a>
              )}
              <Link
                href={data?.sponsorUrl || '/become-a-sponsor'}
                className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
              >
                Become a Sponsor
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Nyansa Futures Conference — Beyond AI',
  description:
    'Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation in Africa.',
}
