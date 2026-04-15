import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { FAQ } from '@/components/FAQ'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { NyansaFuture } from '@/payload-types'

export default async function NyansaFuturesPage() {
  const data = (await getCachedGlobal('nyansa-futures', 1)()) as NyansaFuture

  const faqItems =
    data?.faq?.map((item) => ({
      question: item.question,
      answer: item.answer,
    })) || []

  const attendees = data?.whoShouldAttend?.split('\n').filter(Boolean) || []

  return (
    <article>
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {data?.heroImage && typeof data.heroImage !== 'number' ? (
          <>
            <Media resource={data.heroImage} fill imgClassName="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}

        <div className="container relative z-10 pb-16 pt-32 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            Join <span className="text-primary">Nyansa Futures</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Be part of the conversation shaping Africa&apos;s AI future.
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
        </div>
      </section>

      {data?.description && (
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-sm tracking-widest uppercase text-primary mb-4">[About]</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
                  What is
                  <br />
                  Nyansa Futures?
                </h2>
              </div>
              <div>
                <RichText data={data.description} enableGutter={false} />
              </div>
            </div>
          </div>
        </section>
      )}

      {data?.whyItMatters && (
        <section className="bg-card py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[Purpose]</p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
                Why It Matters
              </h2>
              <div className="border-l-2 border-primary pl-6">
                <RichText data={data.whyItMatters} enableGutter={false} />
              </div>
            </div>
          </div>
        </section>
      )}

      {attendees.length > 0 && (
        <section className="py-20">
          <div className="container">
            <p className="text-sm tracking-widest uppercase text-primary mb-4">[Audience]</p>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-10">
              Who Should Attend
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {attendees.map((item, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 p-5 border border-border hover:border-primary transition-colors"
                >
                  <span className="text-primary text-sm font-mono shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-foreground">{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.format && (
        <section className="bg-card py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[Format]</p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
                Conference Format
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {data.format}
              </p>
            </div>
          </div>
        </section>
      )}

      {data?.keyThemes && data.keyThemes.length > 0 && (
        <section className="py-20">
          <div className="container">
            <p className="text-sm tracking-widest uppercase text-primary mb-4">[Themes]</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight mb-12">
              Key Themes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/20">
              {data.keyThemes.map((item, i) => (
                <div
                  key={i}
                  className="group relative p-8 bg-background border-l-2 border-transparent hover:border-primary transition-all duration-300"
                >
                  <span className="text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors font-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-2 tracking-tight">{item.theme}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.expectedOutcomes && data.expectedOutcomes.length > 0 && (
        <section className="bg-card py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[Outcomes]</p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-10">
                Expected Outcomes
              </h2>
              <div className="space-y-0">
                {data.expectedOutcomes.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-5 py-5 border-b border-border last:border-b-0"
                  >
                    <span className="text-2xl font-bold text-primary font-mono shrink-0 leading-tight">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-foreground leading-relaxed">{item.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[FAQ]</p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8">
                Frequently Asked Questions
              </h2>
              <FAQ items={faqItems} />
            </div>
          </div>
        </section>
      )}

    </article>
  )
}

export const metadata: Metadata = {
  title: 'Nyansa Futures Conference — Beyond AI',
  description:
    'Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation in Africa.',
}
