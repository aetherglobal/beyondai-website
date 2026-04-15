import type { Metadata } from 'next'
import React from 'react'
import { VolunteerForm } from '@/components/VolunteerForm'

export default function VolunteerPage() {
  return (
    <article className="pt-16 pb-24">
      <section className="container py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Volunteer</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Join the Beyond AI movement. Contribute your skills and help shape the future of AI
          governance in Africa.
        </p>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What Volunteering Involves</h2>
            <p className="text-muted-foreground mb-6">
              Beyond AI welcomes volunteers from all backgrounds who share our commitment to
              responsible AI governance. Whether you&apos;re a researcher, communications
              professional, event organizer, or community advocate, there&apos;s a role for you.
            </p>

            <h3 className="text-lg font-semibold mb-3">Types of Roles</h3>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Event Support</h4>
                <p className="text-sm text-muted-foreground">
                  Help organize and coordinate AI Watch forums and other Beyond AI events.
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Research and Writing</h4>
                <p className="text-sm text-muted-foreground">
                  Contribute to articles, policy briefs, and research on AI governance topics.
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Media and Communications</h4>
                <p className="text-sm text-muted-foreground">
                  Support content creation, social media, and the Beyond the Algorithm initiative.
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Community Outreach</h4>
                <p className="text-sm text-muted-foreground">
                  Engage communities and expand the reach of the Beyond AI initiative.
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium">Logistics</h4>
                <p className="text-sm text-muted-foreground">
                  Support the operational side of events and day-to-day activities.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below and we&apos;ll be in touch with volunteer opportunities that
              match your interests.
            </p>
            <VolunteerForm />
          </div>
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
