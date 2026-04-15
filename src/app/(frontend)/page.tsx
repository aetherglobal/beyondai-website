import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/EventCard'
import { ProgramCard } from '@/components/ProgramCard'
import { SponsorGrid } from '@/components/SponsorGrid'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Media } from '@/components/Media'
import { Card } from '@/components/Card'

import type { Event, Post, Sponsor } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [eventsResult, articlesResult, sponsorsResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { eventStatus: { equals: 'upcoming' }, _status: { equals: 'published' } },
      sort: 'date',
      limit: 3,
      depth: 1,
    }),
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }),
    payload.find({
      collection: 'sponsors',
      where: { featured: { equals: true } },
      sort: 'sortOrder',
      limit: 10,
      depth: 1,
    }),
  ])

  const nextEvent = eventsResult.docs[0] as Event | undefined
  const upcomingEvents = eventsResult.docs as Event[]
  const latestArticles = articlesResult.docs as Post[]
  const sponsors = sponsorsResult.docs as Sponsor[]

  return (
    <article className="bg-white text-black space-y-16">
      <section className="relative bg-background min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute top-0 right-0 bottom-0 w-[55%]">
            {nextEvent?.heroImage && typeof nextEvent.heroImage !== 'number' ? (
              <Media resource={nextEvent.heroImage} fill imgClassName="object-cover" />
            ) : (
              <div className="w-full h-full bg-card" />
            )}
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent" />
          </div>
        </div>

        <div className="container relative z-10 py-20 md:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <p className="text-sm tracking-widest uppercase text-primary mb-4">
                Govern / Innovate / Transform
              </p>

              <h1 className="text-4xl text-white sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                Shaping the Future of AI in Africa
              </h1>

              {nextEvent && (
                <p className="text-muted-foreground mb-4">
                  {new Date(nextEvent.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                  {nextEvent.endDate && (
                    <>
                      {' - '}
                      {new Date(nextEvent.endDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </>
                  )}
                  {!nextEvent.endDate && <>, {new Date(nextEvent.date).getFullYear()}</>}
                  {nextEvent.location && <> in {nextEvent.location}</>}
                </p>
              )}

              <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                A civic platform bringing together policymakers, innovators, and citizens to shape
                responsible AI governance and digital transformation across the continent.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {nextEvent?.lumaEventUrl ? (
                  <a
                    href={nextEvent.lumaEventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
                  >
                    Register for Next Event
                  </a>
                ) : (
                  <Link
                    href="/events"
                    className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
                  >
                    Register for Next Event
                  </Link>
                )}
                <Link
                  href="#footer-newsletter"
                  className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
                >
                  Join Newsletter
                </Link>
              </div>

              {nextEvent && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Next event starts in
                  </p>
                  <CountdownTimer targetDate={nextEvent.date} />
                </div>
              )}
            </div>

            <div className="lg:hidden aspect-video overflow-hidden relative">
              {nextEvent?.heroImage && typeof nextEvent.heroImage !== 'number' ? (
                <Media resource={nextEvent.heroImage} fill imgClassName="object-cover" />
              ) : (
                <div className="w-full h-full bg-card" />
              )}
            </div>
          </div>
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-black text-black text-sm font-medium hover:bg-secondary hover:border-secondary hover:text-white transition-colors"
              >
                View All Events
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="container py-16 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[About]</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1]">
                Shaping AI
                <br />
                Governance in Africa
              </h2>
            </div>
            <div className="shrink-0">
              <Link
                href="/about"
                className="inline-flex items-center px-4 py-2 border border-black text-black text-sm font-medium hover:bg-secondary hover:border-secondary hover:text-white transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="container lg:max-w-none p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-6">
              <ChevronsRight className="w-10 h-10 text-primary" strokeWidth={1} />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-4">
              Our Purpose and Goals
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We started with a simple goal, to bring together Africa&apos;s brightest minds. Our
              purpose is to inspire innovation and spark discussions that push technology forward.
              Through monthly forums, research publications, and our annual Nyansa Futures
              conference, we are building a movement for inclusive digital transformation across the
              continent.
            </p>
          </div>

          <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-[400px]">
            <Image
              src="/media/headway-F2KRf_QfCqw-unsplash-1920x1280.jpg"
              alt="Beyond AI conference gathering"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="mb-12">
            <p className="text-sm tracking-widest uppercase text-primary mb-4">[Programs]</p>
            <h2 className="text-4xl text-white sm:text-5xl font-bold uppercase tracking-tight leading-tight mb-4">
              What We Do
            </h2>
            <p className="text-accent-foreground/60 max-w-xl text-base leading-relaxed">
              Four initiatives driving responsible AI governance, public awareness, and continental
              dialogue.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/20">
            <ProgramCard
              title="AI Watch"
              description="Monthly forums bringing together diverse voices to discuss pressing AI governance topics affecting Africa and the world."
              href="/events"
            />
            <ProgramCard
              title="AI Pulse"
              description="Our newsletter and knowledge platform delivering curated insights, research, and commentary on AI policy and innovation."
              href="/posts"
            />
            <ProgramCard
              title="Beyond the Algorithm"
              description="A storytelling and media initiative exploring how AI impacts everyday lives across African communities."
            />
            <ProgramCard
              title="Nyansa Futures"
              description="Our annual flagship conference gathering policymakers, innovators, and academics to shape Africa's AI future."
              href="/nyansa-futures"
            />
          </div>
        </div>
      </section>

      {latestArticles.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Latest Articles</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/posts">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <Card key={article.id} doc={article} relationTo="posts" showCategories />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm tracking-widest uppercase text-primary mb-4">
                [Flagship Conference]
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
                Nyansa
                <br />
                <span className="text-secondary">Futures</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                Nyansa Futures gathers policymakers, innovators, academics, and civil society to
                discuss AI governance and digital transformation. A two-day hybrid conference
                focused on shaping Africa&apos;s technological future.
              </p>
              <Link
                href="/nyansa-futures"
                className="inline-flex items-center px-7 py-3.5 bg-secondary text-secondary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
              >
                Learn More
              </Link>
            </div>
            <div className="relative aspect-4/3">
              <Image
                src="/media/headway-F2KRf_QfCqw-unsplash-1920x1280.jpg"
                alt="Nyansa Futures conference"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {sponsors.length > 0 && (
        <section className="py-20 mb-16 bg-background">
          <div className="container">
            <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white text-center mb-12">
              Meet Our Partners
            </h2>
            <SponsorGrid sponsors={sponsors} />
          </div>
        </section>
      )}

    </article>
  )
}

export const metadata: Metadata = {
  title: 'Beyond AI — AI Governance & Digital Transformation in Africa',
  description:
    'Beyond AI is a civic platform shaping the future of AI governance and digital transformation in Africa through forums, research, and community engagement.',
}
