import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, Target } from 'lucide-react'
const objectives = [
  {
    number: '01',
    title: 'Convene & Connect',
    description:
      'Bring together diverse stakeholders for meaningful dialogue on AI policy and governance across the African continent.',
  },
  {
    number: '02',
    title: 'Research & Publish',
    description:
      'Produce accessible knowledge on AI governance, digital rights, and innovation in Africa that informs policy and public understanding.',
  },
  {
    number: '03',
    title: 'Amplify & Advocate',
    description:
      'Elevate African perspectives in global AI governance conversations and policy processes to ensure the continent shapes its own digital future.',
  },
]

export default function AboutPage() {
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
          <p className="text-sm tracking-widest uppercase text-primary mb-6">[About]</p>

          <h1 className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-8">
            Beyond AI Is A<br />
            Civic Platform For
            <br />
            <span className="text-primary">Africa&apos;s AI Future</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A civic platform dedicated to advancing responsible AI governance and digital
            transformation in Africa — through research, forums, storytelling, and our annual Nyansa
            Futures conference.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#programs"
              className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Explore Our Programs
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
            >
              Read Our Articles
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-4/5 border-t-2 border-primary overflow-hidden">
                <Image
                  src="/media/headway-F2KRf_QfCqw-unsplash-1920x1280.jpg"
                  alt="Beyond AI community engagement"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-4 text-gray-900">
                What is Beyond AI?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Beyond AI is an ongoing initiative that facilitates critical conversations between
                policymakers, technologists, academics, and civil society about the role of
                artificial intelligence in Africa. Through research, forums, storytelling, and our
                annual Nyansa Futures conference, we aim to shape an AI future that serves the
                public good.
              </p>

              <div className="w-16 h-0.5 bg-primary my-8" />

              <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-4 text-gray-900">
                Why It Exists
              </h2>
              <p className="text-gray-600 leading-relaxed">
                As AI technologies rapidly reshape economies, governance, and daily life, African
                voices must be central to the global conversation. Beyond AI exists to ensure that
                the continent&apos;s diverse perspectives, challenges, and innovations are reflected
                in AI governance frameworks and digital transformation strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="border-l-2 border-white/30 pl-6">
              <Eye className="w-8 h-8 text-primary-foreground mb-4" strokeWidth={1.5} />
              <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-3 text-primary-foreground">
                Our Vision
              </h2>
              <div className="w-12 h-0.5 bg-white/30 mb-4" />
              <p className="text-primary-foreground/80 leading-relaxed">
                An Africa where AI governance is inclusive, equitable, and driven by the voices of
                its people — where technology serves communities and strengthens democratic
                institutions.
              </p>
            </div>

            <div className="border-l-2 border-white/30 pl-6">
              <Target className="w-8 h-8 text-primary-foreground mb-4" strokeWidth={1.5} />
              <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-3 text-primary-foreground">
                Our Mission
              </h2>
              <div className="w-12 h-0.5 bg-white/30 mb-4" />
              <p className="text-primary-foreground/80 leading-relaxed">
                To build a vibrant civic platform that convenes stakeholders, produces knowledge,
                and amplifies African perspectives on AI governance and digital transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark py-16 md:py-20">
        <div className="container">
          <p className="text-sm tracking-widest uppercase text-primary mb-4">
            [Strategic Objectives]
          </p>
          <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-12">
            What We Aim To Achieve
          </h2>

          <div>
            {objectives.map((obj, i) => (
              <div
                key={obj.number}
                className={`flex flex-col sm:flex-row items-start gap-4 sm:gap-8 py-8 border-b border-border ${i === 0 ? 'border-t' : ''}`}
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-3xl md:text-4xl font-bold text-primary">{obj.number}</span>
                  <span className="hidden sm:block w-8 h-0.5 bg-border" />
                </div>
                <div>
                  <h3 className="text-lg  text-white font-semibold mb-2">{obj.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="bg-primary py-16 md:py-20">
        <div className="container">
          <p className="text-sm tracking-widest uppercase text-primary-foreground/60 mb-4">
            [Programs]
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-primary-foreground mb-4">
            What We Do
          </h2>
          <p className="text-primary-foreground/70 max-w-xl text-base leading-relaxed mb-12">
            Four initiatives driving responsible AI governance, public awareness, and continental
            dialogue.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary-foreground/10">
            <div className="group relative p-8 bg-primary-foreground/5 border-l-2 border-transparent hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              <h3 className="text-xl text-primary-foreground font-bold mb-3 tracking-tight">
                AI Watch
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Monthly forums bringing together diverse voices to discuss pressing AI governance
                topics affecting Africa and the world.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
              </div>
            </div>
            <div className="group relative p-8 bg-primary-foreground/5 border-l-2 border-transparent hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              <h3 className="text-xl text-primary-foreground font-bold mb-3 tracking-tight">
                AI Pulse
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Our newsletter and knowledge platform delivering curated insights, research, and
                commentary on AI policy and innovation.
              </p>
            </div>
            <div className="group relative p-8 bg-primary-foreground/5 border-l-2 border-transparent hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              <h3 className="text-xl text-primary-foreground font-bold mb-3 tracking-tight">
                Beyond the Algorithm
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                A storytelling and media initiative exploring how AI impacts everyday lives across
                African communities.
              </p>
            </div>
            <div className="group relative p-8 bg-primary-foreground/5 border-l-2 border-transparent hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
              <h3 className="text-xl text-primary-foreground font-bold mb-3 tracking-tight">
                Nyansa Futures
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Our annual flagship conference gathering policymakers, innovators, and academics to
                shape Africa&apos;s AI future.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-12 text-gray-900">
            Organizations Behind the Initiative
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-t-2 border-primary pt-6">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-lg">A</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Aether Strategies</h3>
              <p className="text-gray-600 leading-relaxed">
                A policy and strategy advisory firm working at the intersection of technology,
                governance, and society. Aether Strategies brings deep expertise in public policy
                and digital transformation to the Beyond AI initiative.
              </p>
            </div>

            <div className="border-t-2 border-primary pt-6">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-lg">B</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Bilili Creative Lab</h3>
              <p className="text-gray-600 leading-relaxed">
                A creative studio dedicated to storytelling, media production, and community
                engagement around technology and society. Bilili Creative Lab shapes the narrative
                voice and visual identity of Beyond AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark py-16 md:py-20">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-4">
            Join the Movement
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Be part of shaping Africa&apos;s AI future. Whether you volunteer, partner, or stay
            informed — every voice matters.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/volunteer"
              className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Volunteer
            </Link>
            <Link
              href="/sponsors"
              className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
            >
              Become a Sponsor
            </Link>
            <Link
              href="#footer-newsletter"
              className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'About — Beyond AI',
  description:
    'Learn about the Beyond AI initiative, our vision for responsible AI governance in Africa, and the organizations driving the movement.',
}
