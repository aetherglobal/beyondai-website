import type { Payload, PayloadRequest } from 'payload'

import type { Page } from '@/payload-types'

type PageInput = Omit<Page, 'id' | 'createdAt' | 'updatedAt' | '_status'> & {
  _status?: 'draft' | 'published'
}

export const buildHomePage = (): PageInput => ({
  title: 'Home',
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'featuredEvent',
    eyebrow: 'Govern / Innovate / Transform',
    title: 'Shaping the Future of AI in Africa',
    subtitle:
      'A civic platform bringing together policymakers, innovators, and citizens to shape responsible AI governance and digital transformation across the continent.',
    ctas: [
      { label: 'Register for Next Event', href: '/events', variant: 'primary', useEventLumaUrl: true },
      { label: 'Join Newsletter', href: '#footer-newsletter', variant: 'outline', useEventLumaUrl: false },
    ],
    bindNextEvent: true,
  } as Page['hero'],
  layout: [
    {
      blockType: 'upcomingEvents',
      heading: 'Upcoming Events',
      ctaLabel: 'View All Events',
      ctaHref: '/events',
      limit: 3,
    },
    {
      blockType: 'statementSection',
      eyebrow: '[About]',
      heading: 'Shaping AI\nGovernance in Africa',
      sideCta: {
        link: {
          type: 'custom',
          label: 'Learn More',
          url: '/about',
        },
      },
      subheading: 'Our Purpose and Goals',
      body: richTextFromParagraph(
        'We started with a simple goal, to bring together Africa\'s brightest minds. Our purpose is to inspire innovation and spark discussions that push technology forward. Through monthly forums, research publications, and our annual Nyansa Futures conference, we are building a movement for inclusive digital transformation across the continent.',
      ),
      showIcon: true,
      background: 'secondary',
    },
    {
      blockType: 'programsGrid',
      eyebrow: '[Programs]',
      heading: 'What We Do',
      subheading:
        'Four initiatives driving responsible AI governance, public awareness, and continental dialogue.',
      background: 'primary',
      columns: '2',
      items: [
        {
          title: 'AI Watch',
          description:
            'Monthly forums bringing together diverse voices to discuss pressing AI governance topics affecting Africa and the world.',
        },
        {
          title: 'AI Pulse',
          description:
            'Our newsletter and knowledge platform delivering curated insights, research, and commentary on AI policy and innovation.',
        },
        {
          title: 'Beyond the Algorithm',
          description:
            'A storytelling and media initiative exploring how AI impacts everyday lives across African communities.',
        },
        {
          title: 'Nyansa Futures',
          description:
            'Our annual flagship conference gathering policymakers, innovators, and academics to shape Africa\'s AI future.',
          link: { type: 'custom', url: '/nyansa-futures', label: 'Learn more' },
        },
      ],
    },
    {
      blockType: 'latestArticles',
      heading: 'Latest Articles',
      ctaLabel: 'View All Articles',
      ctaHref: '/posts',
      limit: 3,
    },
    {
      blockType: 'splitContent',
      eyebrow: '[Flagship Conference]',
      heading: 'Nyansa',
      headingAccent: 'Futures',
      body: richTextFromParagraph(
        'Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation. A two-day hybrid conference focused on shaping Africa\'s technological future.',
      ),
      imagePosition: 'right',
      background: 'white',
      links: [
        {
          link: {
            type: 'custom',
            label: 'Learn More',
            url: '/nyansa-futures',
            appearance: 'default',
          },
        },
      ],
    },
    {
      blockType: 'featuredSponsors',
      heading: 'Meet Our Partners',
      limit: 10,
      featuredOnly: true,
    },
  ] as Page['layout'],
  meta: {
    title: 'Beyond AI — AI Governance & Digital Transformation in Africa',
    description:
      'Beyond AI is a civic platform shaping the future of AI governance and digital transformation in Africa through forums, research, and community engagement.',
  },
})

export const buildAboutPage = (): PageInput => ({
  title: 'About',
  slug: 'about',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[About]',
    heading: 'Beyond AI Is A Civic Platform For',
    headingAccent: "Africa's AI Future",
    subtitle:
      'A civic platform dedicated to advancing responsible AI governance and digital transformation in Africa — through research, forums, storytelling, and our annual Nyansa Futures conference.',
    ctas: [
      { label: 'Explore Our Programs', href: '#programs', variant: 'primary', useEventLumaUrl: false },
      { label: 'Read Our Articles', href: '/posts', variant: 'outline', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    {
      blockType: 'splitContent',
      heading: 'What is Beyond AI?',
      body: richTextFromTwoParagraphs(
        'Beyond AI is an ongoing initiative that facilitates critical conversations between policymakers, technologists, academics, and civil society about the role of artificial intelligence in Africa. Through research, forums, storytelling, and our annual Nyansa Futures conference, we aim to shape an AI future that serves the public good.',
        'As AI technologies rapidly reshape economies, governance, and daily life, African voices must be central to the global conversation. Beyond AI exists to ensure that the continent\'s diverse perspectives, challenges, and innovations are reflected in AI governance frameworks and digital transformation strategies.',
      ),
      imagePosition: 'left',
      background: 'white',
    },
    {
      blockType: 'programsGrid',
      background: 'dark',
      columns: '2',
      items: [
        {
          title: 'Our Vision',
          description:
            'An Africa where AI governance is inclusive, equitable, and driven by the voices of its people — where technology serves communities and strengthens democratic institutions.',
        },
        {
          title: 'Our Mission',
          description:
            'To build a vibrant civic platform that convenes stakeholders, produces knowledge, and amplifies African perspectives on AI governance and digital transformation.',
        },
      ],
    },
    {
      blockType: 'objectivesGrid',
      eyebrow: '[Strategic Objectives]',
      heading: 'What We Aim To Achieve',
      items: [
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
      ],
    },
    {
      blockType: 'programsGrid',
      eyebrow: '[Programs]',
      heading: 'What We Do',
      subheading:
        'Four initiatives driving responsible AI governance, public awareness, and continental dialogue.',
      background: 'primary',
      columns: '2',
      items: [
        {
          title: 'AI Watch',
          description:
            'Monthly forums bringing together diverse voices to discuss pressing AI governance topics affecting Africa and the world.',
          link: { type: 'custom', url: '/events', label: 'Learn more' },
        },
        {
          title: 'AI Pulse',
          description:
            'Our newsletter and knowledge platform delivering curated insights, research, and commentary on AI policy and innovation.',
        },
        {
          title: 'Beyond the Algorithm',
          description:
            'A storytelling and media initiative exploring how AI impacts everyday lives across African communities.',
        },
        {
          title: 'Nyansa Futures',
          description:
            "Our annual flagship conference gathering policymakers, innovators, and academics to shape Africa\'s AI future.",
          link: { type: 'custom', url: '/nyansa-futures', label: 'Learn more' },
        },
      ],
    },
    {
      blockType: 'programsGrid',
      heading: 'Organizations Behind the Initiative',
      background: 'white',
      columns: '2',
      items: [
        {
          title: 'Aether Strategies',
          description:
            'A policy and strategy advisory firm working at the intersection of technology, governance, and society. Aether Strategies brings deep expertise in public policy and digital transformation to the Beyond AI initiative.',
        },
        {
          title: 'Bilili Creative Lab',
          description:
            'A creative studio dedicated to storytelling, media production, and community engagement around technology and society. Bilili Creative Lab shapes the narrative voice and visual identity of Beyond AI.',
        },
      ],
    },
    {
      blockType: 'statementSection',
      heading: 'Join the Movement',
      subheading: 'Get Involved',
      body: richTextFromParagraph(
        "Be part of shaping Africa\'s AI future. Whether you volunteer, partner, or stay informed — every voice matters.",
      ),
      showIcon: false,
      background: 'secondary',
      sideCta: {
        link: {
          type: 'custom',
          label: 'Volunteer',
          url: '/volunteer',
        },
      },
    },
  ] as Page['layout'],
  meta: {
    title: 'About — Beyond AI',
    description:
      'Beyond AI is a civic platform convening Africa\'s AI community around governance, research, and responsible innovation.',
  },
})

export const buildVolunteerPage = (): PageInput => ({
  title: 'Volunteer',
  slug: 'volunteer',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[Volunteer]',
    heading: "Lend Your Skills To\nShape Africa\'s",
    headingAccent: 'AI Future',
    subtitle:
      'Join a growing community of researchers, communicators, organizers, and advocates working to ensure AI governance in Africa is inclusive, informed, and people-centered.',
    ctas: [
      { label: 'Join the Team', href: '#volunteer-form', variant: 'primary', useEventLumaUrl: false },
      { label: 'See Roles', href: '#roles', variant: 'outline', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    {
      blockType: 'splitContent',
      eyebrow: '[Why Volunteer]',
      heading: 'Make A Real Impact',
      body: richTextFromParagraph(
        "Beyond AI volunteers don\'t just fill seats — they shape outcomes. Every contribution advances responsible AI governance across the continent, while building your own skills, network, and understanding of one of the most important issues of our time.",
      ),
      imagePosition: 'right',
      background: 'secondary',
    },
    {
      blockType: 'objectivesGrid',
      eyebrow: '[Roles]',
      heading: 'Find Your Role',
      items: [
        {
          number: '01',
          title: 'Event Support',
          description:
            'Help organize and coordinate AI Watch forums, Nyansa Futures conference sessions, and other Beyond AI events.',
        },
        {
          number: '02',
          title: 'Research & Writing',
          description:
            'Contribute to articles, policy briefs, and research publications on AI governance topics across the continent.',
        },
        {
          number: '03',
          title: 'Media & Communications',
          description:
            'Support content creation, social media strategy, and the Beyond the Algorithm storytelling initiative.',
        },
        {
          number: '04',
          title: 'Community Outreach',
          description:
            'Engage communities, build partnerships, and expand the reach of Beyond AI across Africa and the diaspora.',
        },
        {
          number: '05',
          title: 'Logistics',
          description:
            'Support the operational backbone of events, conferences, and day-to-day activities that keep the initiative running.',
        },
      ],
    },
    {
      blockType: 'timelineSteps',
      eyebrow: '[Process]',
      heading: 'How It Works',
      steps: [
        {
          title: 'Sign Up',
          description:
            'Fill out a short form with your background, skills, and areas of interest. It takes less than two minutes.',
        },
        {
          title: 'Get Matched',
          description:
            'Our team reviews your profile and connects you with volunteer opportunities that align with your expertise.',
        },
        {
          title: 'Make Impact',
          description:
            'Start contributing to projects, events, and research that shape responsible AI governance across Africa.',
        },
      ],
    },
    {
      blockType: 'testimonialList',
      eyebrow: '[Voices]',
      heading: 'From Our Volunteers',
      items: [
        {
          quote:
            'Volunteering with Beyond AI gave me a front-row seat to the most important conversations about technology and governance happening on the continent. The experience was transformative.',
          author: 'Amara K.',
          role: 'Research Volunteer',
        },
        {
          quote:
            'As someone passionate about communications, working with the Beyond the Algorithm team helped me see how storytelling can make complex AI issues accessible to everyone.',
          author: 'David O.',
          role: 'Media & Communications Volunteer',
        },
      ],
    },
    {
      blockType: 'volunteerForm',
      eyebrow: '[Get Started]',
      heading: 'Join The Movement',
      subheading:
        'Fill out the form and we\'ll match you with volunteer opportunities that fit your skills and interests. It takes less than two minutes.',
    },
    {
      blockType: 'faqBlock',
      eyebrow: '[FAQ]',
      heading: 'Common Questions',
      items: [
        {
          question: 'How much time is expected from volunteers?',
          answer: richTextFromParagraph(
            'Time commitments vary by role. Most volunteers contribute 3-8 hours per month, but we work with you to find a schedule that fits.',
          ),
        },
        {
          question: 'Do I need specific skills or experience?',
          answer: richTextFromParagraph(
            'Not necessarily. We welcome volunteers with diverse backgrounds. What matters most is your passion for responsible AI governance in Africa.',
          ),
        },
        {
          question: 'Can I volunteer remotely?',
          answer: richTextFromParagraph(
            'Yes! Most of our volunteer roles can be done remotely. We use digital tools to collaborate across time zones and geographies.',
          ),
        },
        {
          question: 'What is the minimum commitment?',
          answer: richTextFromParagraph(
            'We ask for a minimum commitment of three months so you can get fully onboarded and make a meaningful contribution.',
          ),
        },
        {
          question: 'How will I be contacted after signing up?',
          answer: richTextFromParagraph(
            'Our volunteer coordinator will reach out within one week of your application to schedule a brief introductory conversation.',
          ),
        },
      ],
    },
  ] as Page['layout'],
  meta: { title: 'Volunteer — Beyond AI', description: "Join Beyond AI as a volunteer and help shape Africa\'s AI future." },
})

export const buildBecomeSponsorPage = (): PageInput => ({
  title: 'Become a Sponsor',
  slug: 'become-a-sponsor',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[Partnership]',
    heading: "Become A Partner In\nShaping Africa\'s",
    headingAccent: 'AI Future',
    subtitle:
      'Join a growing coalition of organizations supporting responsible AI governance and digital transformation across the continent.',
    ctas: [
      { label: 'Partner with Us', href: '#sponsor-form', variant: 'primary', useEventLumaUrl: false },
      { label: 'View Current Partners', href: '/sponsors', variant: 'outline', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    {
      blockType: 'splitContent',
      eyebrow: '[Why Partner]',
      heading: 'Invest in Africa\'s AI Future',
      body: richTextFromParagraph(
        'Our sponsors help power forums, research, and the Nyansa Futures conference. Partnership with Beyond AI positions your organization at the center of Africa\'s AI governance conversation.',
      ),
      imagePosition: 'right',
      background: 'secondary',
    },
    {
      blockType: 'programsGrid',
      eyebrow: '[Tiers]',
      heading: 'Partnership Tiers',
      background: 'white',
      columns: '3',
      items: [
        {
          title: 'Lead Partner',
          description: 'Headline sponsorship of the Nyansa Futures conference and year-round programming.',
        },
        {
          title: 'Knowledge Partner',
          description: 'Co-branded research, reports, and insight series distributed through AI Pulse.',
        },
        {
          title: 'Community Partner',
          description: 'Event sponsorship and community-aligned activations across the continent.',
        },
      ],
    },
    {
      blockType: 'faqBlock',
      heading: 'Partnership FAQ',
      items: [
        {
          question: 'How are sponsorship funds used?',
          answer: richTextFromParagraph(
            'Funds support events, research, media production, and operational costs that keep Beyond AI independent and accessible.',
          ),
        },
        {
          question: 'Can we co-create content?',
          answer: richTextFromParagraph(
            'Yes. Knowledge Partners regularly co-author research briefs, host panels, and shape editorial themes with our team.',
          ),
        },
      ],
    },
    {
      blockType: 'sponsorInquiryForm',
      heading: 'Start the Conversation',
      subheading: 'Tell us about your organization and partnership interest.',
    },
  ] as Page['layout'],
  meta: {
    title: 'Become a Sponsor — Beyond AI',
    description: 'Partner with Beyond AI and support AI governance, research, and community engagement across Africa.',
  },
})

export const buildArticlesPage = (): PageInput => ({
  title: 'Articles',
  slug: 'posts',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[Articles]',
    heading: 'Insights On AI\nGovernance &',
    headingAccent: 'Digital Transformation',
    subtitle:
      'Thought leadership, commentary, and research on AI governance, policy, and digital transformation in Africa.',
    ctas: [
      { label: 'Subscribe to Newsletter', href: '#footer-newsletter', variant: 'outline', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    {
      blockType: 'latestArticles',
      heading: 'All Articles',
      limit: 12,
    },
  ] as Page['layout'],
  meta: {
    title: 'Articles — Beyond AI',
    description:
      'Insights on AI governance, policy, and digital transformation in Africa from the Beyond AI initiative.',
  },
})

export const buildNyansaFuturesPage = (): PageInput => ({
  title: 'Nyansa Futures',
  slug: 'nyansa-futures',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[Flagship Conference]',
    heading: "Africa's Premier\nConference On",
    headingAccent: 'AI Governance',
    subtitle:
      'Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation in Africa.',
    ctas: [
      { label: 'Register to Attend', href: '/nyansa-futures#attend', variant: 'primary', useEventLumaUrl: false },
      { label: 'Become a Sponsor', href: '/become-a-sponsor', variant: 'outline', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    {
      blockType: 'statementSection',
      heading: 'A Two-Day Hybrid Conference',
      subheading: 'About the Conference',
      body: richTextFromParagraph(
        'Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation. A flagship conference focused on shaping Africa\'s technological future.',
      ),
      showIcon: false,
      background: 'white',
    },
  ] as Page['layout'],
  meta: {
    title: 'Nyansa Futures Conference — Beyond AI',
    description:
      'Nyansa Futures gathers policymakers, innovators, academics, and civil society to discuss AI governance and digital transformation in Africa.',
  },
})

export const buildEventsPage = (): PageInput => ({
  title: 'Events',
  slug: 'events',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[Events]',
    heading: 'Forums, Workshops &\nConferences On',
    headingAccent: 'AI Governance',
    subtitle:
      'Join our events exploring AI governance and digital transformation in Africa — from monthly AI Watch forums to the annual Nyansa Futures conference.',
    ctas: [
      { label: 'Subscribe for Updates', href: '#footer-newsletter', variant: 'outline', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    { blockType: 'featuredEvent', eyebrow: '[Next Event]' },
    {
      blockType: 'upcomingEvents',
      eyebrow: '[Upcoming]',
      heading: 'More Upcoming Events',
      variant: 'numberedList',
      skipFirst: true,
      limit: 20,
    },
    {
      blockType: 'pastEvents',
      eyebrow: '[Past Events]',
      heading: 'Previous Events',
      limit: 20,
    },
  ] as Page['layout'],
  meta: {
    title: 'Events — Beyond AI',
    description:
      'Browse upcoming and past Beyond AI events including AI Watch forums, workshops, and the Nyansa Futures conference.',
  },
})

export const buildContactPage = (): PageInput => ({
  title: 'Contact',
  slug: 'contact',
  _status: 'published',
  hero: {
    type: 'pageHero',
    eyebrow: '[Contact]',
    heading: "Let's Start A",
    headingAccent: 'Conversation',
    subtitle:
      "Have a question, partnership inquiry, or want to get involved? Reach out to the Beyond AI team — we\'d love to hear from you.",
    ctas: [
      { label: 'Send a Message', href: '#contact-form', variant: 'primary', useEventLumaUrl: false },
    ],
  } as Page['hero'],
  layout: [
    {
      blockType: 'contactForm',
      eyebrow: '[Get In Touch]',
      heading: 'Reach Out\nTo Us',
      subheading: 'We typically respond within 48 hours.',
    },
  ] as Page['layout'],
  meta: {
    title: 'Contact — Beyond AI',
    description: 'Reach out to the Beyond AI team — partnerships, media, and general inquiries.',
  },
})

async function upsertPageBySlug(
  payload: Payload,
  req: PayloadRequest,
  data: PageInput,
): Promise<number> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: data.slug } },
    limit: 1,
    req,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      req,
      overrideAccess: true,
    })
    return updated.id
  }

  const created = await payload.create({
    collection: 'pages',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data as any,
    req,
    overrideAccess: true,
  })
  return created.id
}

export async function seedInitialPages({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<{ pages: { slug: string; id: number }[] }> {
  const pages = [
    buildHomePage(),
    buildAboutPage(),
    buildVolunteerPage(),
    buildBecomeSponsorPage(),
    buildContactPage(),
    buildEventsPage(),
    buildArticlesPage(),
    buildNyansaFuturesPage(),
  ]

  const results: { slug: string; id: number }[] = []
  for (const p of pages) {
    const id = await upsertPageBySlug(payload, req, p)
    results.push({ slug: p.slug!, id })
  }
  return { pages: results }
}

// ---- helpers ----

type LexicalRoot = NonNullable<Page['layout'][number]> extends { richText?: infer R } ? R : never

function richTextFromParagraph(text: string): LexicalRoot {
  return {
    root: {
      type: 'root',
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: null,
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  } as LexicalRoot
}

function richTextFromTwoParagraphs(text1: string, text2: string): LexicalRoot {
  const textNode = (text: string) => ({
    type: 'text' as const,
    detail: 0,
    format: 0,
    mode: 'normal' as const,
    style: '',
    text,
    version: 1,
  })
  const paragraph = (text: string) => ({
    type: 'paragraph' as const,
    direction: null,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [textNode(text)],
  })
  return {
    root: {
      type: 'root',
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      children: [
        paragraph(text1),
        {
          type: 'heading',
          direction: null,
          format: '',
          indent: 0,
          version: 1,
          tag: 'h2',
          children: [textNode('Why It Exists')],
        },
        paragraph(text2),
      ],
    },
  } as LexicalRoot
}

function richTextFromHeading(text: string): LexicalRoot {
  return {
    root: {
      type: 'root',
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'heading',
          direction: null,
          format: '',
          indent: 0,
          version: 1,
          tag: 'h1',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  } as LexicalRoot
}
