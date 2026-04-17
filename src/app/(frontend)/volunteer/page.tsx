import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Calendar, BookOpen, Megaphone, Users, Truck, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/FadeIn'
import { FAQ } from '@/components/FAQ'
import { VolunteerForm } from '@/components/VolunteerForm'

const impactPoints = [
  'Help organize forums that bring together policymakers, researchers, and civil society across Africa.',
  'Contribute to research and articles that shape public understanding of AI governance.',
  'Support storytelling initiatives that make AI accessible to everyday communities.',
  'Build connections with a growing network of innovators and advocates across the continent.',
  'Gain hands-on experience in the emerging field of AI policy and governance.',
]

const roles = [
  {
    icon: Calendar,
    title: 'Event Support',
    description:
      'Help organize and coordinate AI Watch forums, Nyansa Futures conference sessions, and other Beyond AI events.',
  },
  {
    icon: BookOpen,
    title: 'Research & Writing',
    description:
      'Contribute to articles, policy briefs, and research publications on AI governance topics across the continent.',
  },
  {
    icon: Megaphone,
    title: 'Media & Communications',
    description:
      'Support content creation, social media strategy, and the Beyond the Algorithm storytelling initiative.',
  },
  {
    icon: Users,
    title: 'Community Outreach',
    description:
      'Engage communities, build partnerships, and expand the reach of Beyond AI across Africa and the diaspora.',
  },
  {
    icon: Truck,
    title: 'Logistics',
    description:
      'Support the operational backbone of events, conferences, and day-to-day activities that keep the initiative running.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description:
      'Fill out a short form with your background, skills, and areas of interest. It takes less than two minutes.',
  },
  {
    number: '02',
    title: 'Get Matched',
    description:
      'Our team reviews your profile and connects you with volunteer opportunities that align with your expertise.',
  },
  {
    number: '03',
    title: 'Make Impact',
    description:
      'Start contributing to projects, events, and research that shape responsible AI governance across Africa.',
  },
]

const testimonials = [
  {
    quote:
      'Volunteering with Beyond AI gave me a front-row seat to the most important conversations about technology and governance happening on the continent. The experience was transformative.',
    name: 'Amara K.',
    role: 'Research Volunteer',
  },
  {
    quote:
      'As someone passionate about communications, working with the Beyond the Algorithm team helped me see how storytelling can make complex AI issues accessible to everyone.',
    name: 'David O.',
    role: 'Media & Communications Volunteer',
  },
]

const faqItems = [
  {
    question: 'How much time is expected from volunteers?',
    answer:
      'Volunteering is flexible. Some roles require just a few hours per month, while others involve more regular engagement around events or publications. We work with your schedule.',
  },
  {
    question: 'Do I need specific skills or experience?',
    answer:
      'Not at all. We welcome volunteers from all backgrounds — students, professionals, retirees, and anyone passionate about responsible AI governance. We will find a role that fits your strengths.',
  },
  {
    question: 'Can I volunteer remotely?',
    answer:
      'Yes. Many of our roles are fully remote, including research, writing, communications, and community outreach. Some event support roles may require in-person attendance.',
  },
  {
    question: 'What is the minimum commitment?',
    answer:
      'There is no strict minimum. You can contribute at your own pace, whether that is a one-time event or an ongoing role. Every contribution counts.',
  },
  {
    question: 'How will I be contacted after signing up?',
    answer:
      'Our volunteer coordination team will reach out via email with opportunities that match your interests and availability, typically within one to two weeks of signing up.',
  },
]

export default function VolunteerPage() {
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
          <p className="text-sm tracking-widest uppercase text-primary mb-6">[Volunteer]</p>

          <h1 className="text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-8">
            Lend Your Skills To
            <br />
            Shape Africa&apos;s
            <br />
            <span className="text-primary">AI Future</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Join a growing community of researchers, communicators, organizers, and advocates
            working to ensure AI governance in Africa is inclusive, informed, and people-centered.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#volunteer-form"
              className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Join the Team
            </a>
            <a
              href="#roles"
              className="inline-flex items-center px-7 py-3.5 border border-primary text-primary font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all"
            >
              See Roles
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <p className="text-sm tracking-widest uppercase text-primary mb-4">
                  [Why Volunteer]
                </p>
                <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-4 text-gray-900">
                  Make A Real Impact
                </h2>
                <div className="w-16 h-0.5 bg-primary mb-6" />
                <p className="text-gray-600 leading-relaxed">
                  Beyond AI volunteers don&apos;t just fill seats — they shape outcomes. Every
                  contribution advances responsible AI governance across the continent, while
                  building your own skills, network, and understanding of one of the most important
                  issues of our time.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="space-y-0">
                  {impactPoints.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0"
                    >
                      <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-gray-600 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="roles" className="bg-dark py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <p className="text-sm tracking-widest uppercase text-primary mb-4">[Roles]</p>
            <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-4">
              Find Your Role
            </h2>
            <p className="text-muted-foreground max-w-xl text-base leading-relaxed mb-12">
              Whether you&apos;re a researcher, communicator, organizer, or community builder —
              there&apos;s a place for you.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role, i) => (
              <FadeIn key={role.title} delay={i * 0.08}>
                <div className="group flex flex-col p-8 bg-card border-l-2 border-transparent hover:border-primary transition-all duration-300 h-full">
                  <span className="text-3xl font-bold text-primary/40 group-hover:text-primary transition-colors font-mono mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                    <role.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{role.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <p className="text-sm tracking-widest uppercase text-primary-foreground/60 mb-4">
              [Process]
            </p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-primary-foreground mb-12">
              How It Works
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 0.1}>
                <div className="border-l-2 border-white/30 pl-6">
                  <span className="text-4xl font-bold text-primary-foreground/30 font-mono">
                    {step.number}
                  </span>
                  <h3 className="text-xl text-primary-foreground font-bold mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <p className="text-sm tracking-widest uppercase text-primary mb-4">[Voices]</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-12 text-gray-900">
              From Our Volunteers
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="border-t-2 border-primary pt-6">
                  <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="volunteer-form" className="bg-dark py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="text-sm tracking-widest uppercase text-primary mb-4">[Get Started]</p>
                <h2 className="text-3xl text-white md:text-4xl font-bold uppercase tracking-tight mb-4">
                  Join The
                  <br />
                  Movement
                </h2>
                <div className="w-16 h-0.5 bg-primary mb-6" />
                <p className="text-muted-foreground leading-relaxed">
                  Fill out the form and we&apos;ll match you with volunteer opportunities that fit
                  your skills and interests. It takes less than two minutes.
                </p>
              </FadeIn>
            </div>

            <div className="lg:col-span-7">
              <FadeIn delay={0.1}>
                <VolunteerForm />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-sm tracking-widest uppercase text-primary mb-4">[FAQ]</p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8 text-gray-900">
                Common Questions
              </h2>
              <FAQ
                items={faqItems}
                className="[&_button>span:first-child]:text-gray-900 [&_button>span:last-child]:text-gray-500 [&>div>div>div]:text-gray-600 divide-gray-200"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Volunteer — Beyond AI',
  description:
    'Volunteer with Beyond AI. Contribute your skills to advance AI governance and digital transformation in Africa.',
}
