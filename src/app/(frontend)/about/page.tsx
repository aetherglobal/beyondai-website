import type { Metadata } from 'next'
import React from 'react'
import { ProgramCard } from '@/components/ProgramCard'

export default function AboutPage() {
  return (
    <article className="pt-16 pb-24">
      {/* Hero */}
      <section className="container py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Beyond AI</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Beyond AI is a civic platform dedicated to advancing responsible AI governance and digital
          transformation in Africa.
        </p>
      </section>

      {/* What & Why */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What is Beyond AI?</h2>
            <p className="text-muted-foreground">
              Beyond AI is an ongoing initiative that facilitates critical conversations between
              policymakers, technologists, academics, and civil society about the role of artificial
              intelligence in Africa. Through research, forums, storytelling, and our annual Nyansa
              Futures conference, we aim to shape an AI future that serves the public good.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why It Exists</h2>
            <p className="text-muted-foreground">
              As AI technologies rapidly reshape economies, governance, and daily life, African
              voices must be central to the global conversation. Beyond AI exists to ensure that the
              continent&apos;s diverse perspectives, challenges, and innovations are reflected in AI
              governance frameworks and digital transformation strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-card py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                An Africa where AI governance is inclusive, equitable, and driven by the voices of
                its people — where technology serves communities and strengthens democratic
                institutions.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To build a vibrant civic platform that convenes stakeholders, produces knowledge, and
                amplifies African perspectives on AI governance and digital transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="container py-12">
        <h2 className="text-2xl font-semibold mb-8">Strategic Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Convene & Connect</h3>
            <p className="text-sm text-muted-foreground">
              Bring together diverse stakeholders for meaningful dialogue on AI policy and
              governance.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Research & Publish</h3>
            <p className="text-sm text-muted-foreground">
              Produce accessible knowledge on AI governance, digital rights, and innovation in
              Africa.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Amplify & Advocate</h3>
            <p className="text-sm text-muted-foreground">
              Elevate African perspectives in global AI governance conversations and policy
              processes.
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-card py-12">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-8">Programs & Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgramCard
              title="AI Watch"
              description="Monthly forums bringing together diverse voices to discuss pressing AI governance topics affecting Africa and the world."
              href="/events"
            />
            <ProgramCard
              title="AI Pulse"
              description="Our newsletter and knowledge platform delivering curated insights, research, and commentary on AI policy and innovation."
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

      {/* Organizations */}
      <section className="container py-12">
        <h2 className="text-2xl font-semibold mb-8">Organizations Behind the Initiative</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Aether Strategies</h3>
            <p className="text-muted-foreground">
              A policy and strategy advisory firm working at the intersection of technology,
              governance, and society.
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Bilili Creative Lab</h3>
            <p className="text-muted-foreground">
              A creative studio dedicated to storytelling, media production, and community engagement
              around technology and society.
            </p>
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
