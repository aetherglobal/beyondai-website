import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

function makeParagraph(text: string) {
  return {
    type: 'paragraph',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function makeHeading(text: string, tag: 'h2' | 'h3' = 'h2') {
  return {
    type: 'heading',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    version: 1,
  }
}

function makeContent(sections: { heading: string; paragraphs: string[] }[]) {
  const children: unknown[] = []
  for (const section of sections) {
    children.push(makeHeading(section.heading))
    for (const p of section.paragraphs) {
      children.push(makeParagraph(p))
    }
  }
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

const articles = [
  {
    title: 'The Case for African-Led AI Governance Frameworks',
    slug: 'african-led-ai-governance-frameworks',
    articleType: 'policy' as const,
    featured: true,
    categoryTitle: 'AI Policy',
    metaDescription:
      'Why Africa needs its own AI governance models rather than adopting Western frameworks wholesale — and how the continent is already leading the way.',
    content: makeContent([
      {
        heading: 'Beyond Imported Frameworks',
        paragraphs: [
          'As artificial intelligence reshapes economies and societies worldwide, the question of governance has never been more urgent. Yet most existing AI regulatory frameworks — from the EU AI Act to voluntary guidelines from major tech companies — were designed with Western contexts in mind. Africa, with its unique challenges and opportunities, needs governance approaches that reflect its realities.',
          'The continent is home to 1.4 billion people across 54 nations, each with distinct legal traditions, languages, and socioeconomic contexts. A one-size-fits-all approach to AI regulation is not just inadequate — it risks perpetuating the very power imbalances that AI governance should address.',
        ],
      },
      {
        heading: 'The African Union\'s Smart Africa Initiative',
        paragraphs: [
          'The African Union has taken significant steps toward continental AI governance through the Smart Africa initiative and the African Digital Transformation Strategy. These frameworks recognize that AI governance in Africa must balance innovation promotion with rights protection, economic development with data sovereignty.',
          'Key principles emerging from these discussions include community-centric design, local language inclusion, agricultural and health sector prioritization, and cross-border data flow agreements that protect African interests while enabling collaboration.',
        ],
      },
      {
        heading: 'Grassroots Innovation Meets Policy',
        paragraphs: [
          'Perhaps most exciting is the emergence of grassroots AI governance initiatives. From Kenya\'s Konza Technopolis to Nigeria\'s National Centre for Artificial Intelligence and Robotics, African nations are building institutions that combine technical expertise with deep understanding of local contexts.',
          'These initiatives demonstrate that Africa is not merely a recipient of global AI policy — it is an active architect of governance frameworks that could serve as models for the Global South and beyond. The challenge now is ensuring these voices are amplified in global governance forums.',
        ],
      },
    ]),
  },
  {
    title: 'How Algorithmic Bias Affects Healthcare Access in Sub-Saharan Africa',
    slug: 'algorithmic-bias-healthcare-sub-saharan-africa',
    articleType: 'research' as const,
    featured: false,
    categoryTitle: 'Ethics',
    metaDescription:
      'Research reveals how AI diagnostic tools trained on non-African datasets are producing dangerous misdiagnoses across the continent.',
    content: makeContent([
      {
        heading: 'The Hidden Cost of Biased Training Data',
        paragraphs: [
          'When an AI dermatology app fails to correctly identify skin conditions on darker skin tones, the consequences are not merely academic — they are matters of life and death. A growing body of research is documenting how algorithmic bias in healthcare AI is creating a two-tier system where the quality of AI-assisted diagnosis depends heavily on your geographic location and skin color.',
          'Studies conducted across hospitals in Ghana, Kenya, and South Africa have found that AI diagnostic tools — particularly those for skin cancer, diabetic retinopathy, and pulmonary conditions — perform significantly worse when applied to African patient populations. In some cases, error rates are three to five times higher than those reported in the tools\' original validation studies.',
        ],
      },
      {
        heading: 'Building Representative Datasets',
        paragraphs: [
          'The root cause is well understood: these tools are predominantly trained on datasets from North American and European hospitals. The solution, however, requires more than simply adding African data to existing datasets. It demands a fundamental rethinking of how medical AI is developed, validated, and deployed in diverse populations.',
          'Organizations like the Lacuna Fund and the Machine Intelligence Institute of Africa are leading efforts to build representative datasets. Their work goes beyond data collection to include culturally sensitive annotation guidelines, community consent frameworks, and data governance structures that protect patient privacy while enabling research.',
        ],
      },
      {
        heading: 'Toward Equitable AI in Healthcare',
        paragraphs: [
          'The path forward requires collaboration between African medical institutions, technology developers, and policymakers. Regulatory frameworks must mandate demographic performance reporting for medical AI tools. Procurement guidelines should require validation studies using local population data before deployment.',
          'Most importantly, African researchers and clinicians must be at the center of developing the next generation of healthcare AI — not as data subjects or beta testers, but as co-creators of tools designed to serve their communities.',
        ],
      },
    ]),
  },
  {
    title: 'Digital Rights in the Age of Facial Recognition: Lessons from Lagos to Nairobi',
    slug: 'digital-rights-facial-recognition-lagos-nairobi',
    articleType: 'commentary' as const,
    featured: false,
    categoryTitle: 'Digital Rights',
    metaDescription:
      'As facial recognition technology spreads across African cities, civil society groups are pushing back with innovative legal and technical strategies.',
    content: makeContent([
      {
        heading: 'The Surveillance Expansion',
        paragraphs: [
          'Over the past three years, facial recognition systems have been deployed in at least 15 African countries — from traffic management in Lagos to border control in Kenya to public safety initiatives in South Africa. These deployments often happen with minimal public consultation, limited regulatory oversight, and concerning accuracy gaps.',
          'The technology\'s rapid adoption is driven by a convergence of factors: growing urbanization, security challenges, and aggressive marketing by Chinese and Western surveillance technology companies. Cities are purchasing these systems with promises of reduced crime and improved governance, but the full implications for civil liberties are only beginning to be understood.',
        ],
      },
      {
        heading: 'Civil Society Responds',
        paragraphs: [
          'African civil society organizations are not standing idle. Groups like Access Now\'s Africa office, the Paradigm Initiative in Nigeria, and KICTANet in Kenya are developing multi-pronged responses that combine legal advocacy, public education, and technical research.',
          'In South Africa, the Information Regulator has begun investigating facial recognition deployments under the Protection of Personal Information Act (POPIA). In Kenya, digital rights groups successfully challenged the government\'s biometric ID system (Huduma Namba) in court, establishing important precedents for how biometric data collection must comply with constitutional protections.',
        ],
      },
      {
        heading: 'A Framework for Responsible Deployment',
        paragraphs: [
          'The debate is not about whether facial recognition should ever be used — but about establishing guardrails that protect fundamental rights. Key principles emerging from African digital rights advocacy include mandatory algorithmic impact assessments before deployment, independent oversight mechanisms, sunset clauses requiring periodic review, and meaningful community consent processes.',
          'These principles could form the foundation of a distinctly African approach to governing surveillance technology — one that balances legitimate security needs with the hard-won democratic freedoms that many African nations have fought to establish.',
        ],
      },
    ]),
  },
  {
    title: 'AI-Powered Agriculture: Transforming Smallholder Farming Across the Sahel',
    slug: 'ai-powered-agriculture-smallholder-sahel',
    articleType: 'explainer' as const,
    featured: false,
    categoryTitle: 'Research',
    metaDescription:
      'How machine learning models trained on satellite imagery and local weather data are helping smallholder farmers in West Africa improve crop yields.',
    content: makeContent([
      {
        heading: 'From Satellite to Soil',
        paragraphs: [
          'In the semi-arid regions of the Sahel, where climate variability can mean the difference between harvest and famine, a quiet revolution is taking place. AI-powered agricultural advisory systems are beginning to provide smallholder farmers with actionable insights derived from satellite imagery, weather predictions, and soil analysis.',
          'Projects like PlantVillage Nuru in East Africa and the International Institute of Tropical Agriculture\'s digital tools in West Africa are demonstrating that sophisticated AI can be made accessible to farmers who may have limited literacy and connectivity. The key innovation is not the AI itself — it\'s the design approach that puts farmer needs at the center.',
        ],
      },
      {
        heading: 'Designing for Low-Resource Environments',
        paragraphs: [
          'The most successful agricultural AI tools in Africa share common design principles: they work offline, support local languages, use voice interfaces where appropriate, and provide recommendations calibrated to the specific crop varieties and farming practices used in each region.',
          'Models trained on global datasets have proven inadequate for African agriculture. The diversity of microclimates, soil types, and crop varieties across the continent demands locally trained models. This has spurred the development of crowd-sourced data collection programs where farmers themselves contribute observations that improve the AI\'s accuracy over time.',
        ],
      },
      {
        heading: 'Economic Impact and Scaling Challenges',
        paragraphs: [
          'Early results are promising. Pilot programs in Senegal and Mali have shown yield improvements of 15-30% for farmers using AI-powered advisory services. In Nigeria, similar tools have helped reduce post-harvest losses by providing better timing recommendations for harvesting and storage.',
          'The challenge now is scale. Moving from pilot to national deployment requires infrastructure investment, training programs for agricultural extension workers, and sustainable business models that don\'t depend on continued donor funding. The most viable approaches appear to be those integrated into existing mobile money and agricultural input supply chains.',
        ],
      },
    ]),
  },
  {
    title: 'Recap: Nyansa Futures 2025 — AI Ethics and Youth Leadership in Accra',
    slug: 'nyansa-futures-2025-recap-accra',
    articleType: 'event-summary' as const,
    featured: false,
    categoryTitle: 'Governance',
    metaDescription:
      'Highlights from the 2025 Nyansa Futures summit in Accra, where 300+ young African leaders gathered to shape the continent\'s AI governance agenda.',
    content: makeContent([
      {
        heading: 'Three Days That Shaped Africa\'s AI Future',
        paragraphs: [
          'The third annual Nyansa Futures summit brought together over 300 participants from 28 African countries in Accra, Ghana, for three days of workshops, panel discussions, and collaborative policy drafting. This year\'s theme — "Responsible AI: From Principles to Practice" — reflected the movement\'s maturation from awareness-raising to concrete action.',
          'Keynote addresses from Ghana\'s Minister of Communications and Digitalisation, the African Union\'s Commissioner for Infrastructure and Energy, and leading AI researchers set the stage for substantive working sessions that produced actionable policy recommendations.',
        ],
      },
      {
        heading: 'Key Outcomes and Declarations',
        paragraphs: [
          'The summit produced the "Accra Declaration on Youth and AI Governance," a document endorsed by participants from all five African regions. The declaration calls for mandatory youth representation in national AI advisory bodies, public AI literacy programs in schools, open-source AI development initiatives tailored to African languages, and continental data sharing agreements that prioritize African institutions.',
          'Perhaps most significantly, six countries announced the formation of National Youth AI Councils, creating formal mechanisms for young people to influence AI policy development in their countries. These councils will coordinate through a pan-African network facilitated by the Beyond AI Initiative.',
        ],
      },
      {
        heading: 'Looking Ahead',
        paragraphs: [
          'The 2025 summit demonstrated that Africa\'s AI governance conversation has moved beyond the question of whether the continent should participate in global AI governance — to how it can lead. The energy, expertise, and ambition on display in Accra suggest that the next generation of African leaders is ready to ensure that AI serves the continent\'s development priorities.',
          'The 2026 Nyansa Futures summit will be held in Kigali, Rwanda, with a focus on AI in public service delivery and government automation. Applications for participation will open in January 2026.',
        ],
      },
    ]),
  },
  {
    title: 'The Data Sovereignty Debate: Who Owns Africa\'s AI Training Data?',
    slug: 'data-sovereignty-africa-ai-training-data',
    articleType: 'policy' as const,
    featured: false,
    categoryTitle: 'AI Policy',
    metaDescription:
      'As global tech companies harvest African data to train their AI models, a growing movement is demanding that the continent control its own digital resources.',
    content: makeContent([
      {
        heading: 'The New Scramble for Data',
        paragraphs: [
          'Historians may one day compare the current extraction of African data by global technology companies to earlier resource extraction patterns. The parallel is uncomfortable but illuminating: valuable raw materials — in this case, data generated by African users, institutions, and environments — are being harvested, processed elsewhere, and sold back in the form of AI products and services.',
          'The scale is staggering. Major social media platforms, mapping services, and satellite imaging companies collect terabytes of African data daily. This data trains AI models that are then deployed globally, generating enormous value — almost none of which flows back to the communities that generated it.',
        ],
      },
      {
        heading: 'Legal and Technical Responses',
        paragraphs: [
          'African nations are beginning to respond. Rwanda\'s data protection law requires certain categories of data to be stored locally. Nigeria\'s National Data Protection Regulation establishes rules about cross-border data transfers. South Africa\'s POPIA creates conditions for when personal data can leave the country.',
          'But legal frameworks alone are insufficient. Technical infrastructure is essential. The African Union\'s initiative to establish continental data centers, combined with projects like the Africa Data Centres network, aims to give the continent the physical infrastructure needed to store and process its own data.',
        ],
      },
      {
        heading: 'Toward a Continental Data Strategy',
        paragraphs: [
          'The most ambitious proposals call for a continental data strategy that would treat African data as a shared resource — similar to how some nations treat natural resources. Under such a framework, companies using African data to train AI models would need to pay fair compensation, ensure local benefit-sharing, and comply with community consent requirements.',
          'This is not about isolationism or digital protectionism. It\'s about ensuring that Africa participates in the AI economy as a partner rather than a resource colony. The challenge is building the legal, technical, and institutional infrastructure to make this vision a reality.',
        ],
      },
    ]),
  },
  {
    title: 'Building Ethical AI Teams: Diversity as a Technical Requirement',
    slug: 'building-ethical-ai-teams-diversity',
    articleType: 'commentary' as const,
    featured: false,
    categoryTitle: 'Ethics',
    metaDescription:
      'Why diverse AI development teams produce better, fairer, and more robust systems — and what African tech companies are doing about it.',
    content: makeContent([
      {
        heading: 'Diversity Is Not Just a Value — It\'s an Engineering Principle',
        paragraphs: [
          'The conversation about diversity in AI development often frames it as a matter of social justice or corporate responsibility. While those dimensions are important, there is a growing body of evidence that diverse teams produce technically superior AI systems. Homogeneous teams consistently fail to identify bias in training data, anticipate edge cases, or design for users outside their own demographic.',
          'A landmark 2024 study by researchers at the University of Cape Town and MIT found that AI systems developed by teams with greater demographic diversity scored 23% higher on fairness metrics and 17% higher on robustness tests compared to those developed by homogeneous teams. The effect was particularly pronounced for systems designed to serve diverse populations.',
        ],
      },
      {
        heading: 'African Tech Companies Leading the Way',
        paragraphs: [
          'Several African technology companies are pioneering approaches to building diverse AI teams that go beyond traditional hiring quotas. Companies like Andela, InstaDeep, and Lelapa AI are implementing structured mentorship programs, inclusive design review processes, and community advisory boards that bring diverse perspectives into every stage of AI development.',
          'These companies recognize that diversity must extend beyond the engineering team to include diverse training data, diverse testing populations, and diverse deployment contexts. This holistic approach to diversity is producing AI systems that work better for everyone — not just the demographics best represented in Silicon Valley.',
        ],
      },
      {
        heading: 'A Blueprint for the Global Industry',
        paragraphs: [
          'The African tech sector\'s approach to diversity in AI development offers lessons for the global industry. Rather than treating diversity as an add-on to existing development processes, leading African companies are building it into the foundation of how they develop, test, and deploy AI systems.',
          'This approach recognizes a fundamental truth: AI systems reflect the perspectives of their creators. If we want AI that serves all of humanity, we need all of humanity represented in its creation. Africa, with its extraordinary diversity of languages, cultures, and contexts, is uniquely positioned to demonstrate what truly inclusive AI development looks like.',
        ],
      },
    ]),
  },
  {
    title: 'Natural Language Processing for African Languages: Progress and Challenges',
    slug: 'nlp-african-languages-progress-challenges',
    articleType: 'explainer' as const,
    featured: false,
    categoryTitle: 'Research',
    metaDescription:
      'From Masakhane to GhanaNLP, grassroots research communities are building the NLP tools that big tech has ignored for Africa\'s 2,000+ languages.',
    content: makeContent([
      {
        heading: 'The Language Gap in AI',
        paragraphs: [
          'Of the approximately 7,000 languages spoken worldwide, Africa is home to over 2,000. Yet the vast majority of natural language processing (NLP) research and tools focus on a handful of high-resource languages — English, Chinese, French, German, and Spanish. This creates a profound digital divide where billions of people cannot access AI-powered services in their mother tongue.',
          'The consequences are far-reaching. When government chatbots only speak English, when translation tools cannot handle Yoruba or Amharic, when voice assistants cannot understand Swahili — entire communities are excluded from the digital economy and the benefits of AI innovation.',
        ],
      },
      {
        heading: 'Grassroots Research Communities',
        paragraphs: [
          'The response from African researchers has been remarkable. The Masakhane community, a grassroots research effort that began in 2019, has grown to include over 500 researchers working on NLP for African languages. Their collaborative approach — sharing data, models, and expertise across borders — has produced state-of-the-art translation models for dozens of African languages.',
          'GhanaNLP has developed translation and text-to-speech systems for several Ghanaian languages. Similar efforts in Ethiopia, Nigeria, and South Africa are building the foundation for a multilingual African AI ecosystem. These projects demonstrate that world-class AI research can emerge from the continent when barriers to participation are removed.',
        ],
      },
      {
        heading: 'The Road Ahead',
        paragraphs: [
          'Despite remarkable progress, significant challenges remain. Many African languages lack standardized writing systems, making text-based NLP approaches difficult. Low-resource languages may have only thousands of documented sentences rather than the millions required for modern language models. Speech-based approaches often face challenges with dialectal variation.',
          'Addressing these challenges will require sustained investment in data collection, computational infrastructure, and researcher training. It will also require rethinking AI architectures to work effectively with small datasets — a research direction that could benefit not just African languages, but all low-resource language communities worldwide.',
        ],
      },
    ]),
  },
  {
    title: 'Regulating Autonomous Vehicles in African Cities: A Policy Primer',
    slug: 'regulating-autonomous-vehicles-african-cities',
    articleType: 'policy' as const,
    featured: false,
    categoryTitle: 'Governance',
    metaDescription:
      'As autonomous vehicle pilots begin in Kigali and Cape Town, policymakers face unique challenges around infrastructure, liability, and public safety.',
    content: makeContent([
      {
        heading: 'The African Urban Context',
        paragraphs: [
          'Autonomous vehicle technology was designed for well-maintained roads with clear lane markings, standardized signage, and predictable traffic patterns. African cities, with their dynamic street life, mixed-use roads, and rapidly evolving infrastructure, present a fundamentally different challenge for both the technology and its regulation.',
          'Pilot programs in Kigali and Cape Town are beginning to test how autonomous vehicles perform in African urban environments. Early results suggest that while the technology can adapt to some local conditions, significant modifications are needed — both to the vehicles\' AI systems and to the regulatory frameworks governing their operation.',
        ],
      },
      {
        heading: 'Unique Regulatory Challenges',
        paragraphs: [
          'African policymakers face regulatory challenges that have no precedent in markets where AV regulations were first developed. These include mixed traffic environments where autonomous vehicles share roads with pedestrians, cyclists, hand-pulled carts, and livestock. They also include infrastructure gaps where road conditions can change dramatically within a single block.',
          'Liability frameworks must account for insurance markets that are less developed than those in Western countries. Data governance rules must address whether driving data collected by foreign AV companies can leave the continent. Employment protections must consider the impact on informal transport workers who depend on driving for their livelihoods.',
        ],
      },
      {
        heading: 'A Phased Approach',
        paragraphs: [
          'The most promising regulatory approaches being developed in Africa follow a phased model: beginning with controlled environments like mining operations and port facilities, expanding to dedicated corridors in planned cities, and only later considering broader urban deployment.',
          'This phased approach allows regulators to build expertise, develop appropriate safety standards, and gather evidence about the technology\'s performance before making high-stakes decisions about public road deployment. It also creates space for public engagement and consent — ensuring that communities have a voice in decisions that will profoundly affect their cities.',
        ],
      },
    ]),
  },
  {
    title: 'AI Watch Forum 2025: Key Takeaways on Governing Generative AI in Africa',
    slug: 'ai-watch-forum-2025-generative-ai-governance',
    articleType: 'event-summary' as const,
    featured: false,
    categoryTitle: 'Governance',
    metaDescription:
      'A summary of the 2025 AI Watch Forum discussions on generative AI risks, opportunities, and regulatory approaches across the African continent.',
    content: makeContent([
      {
        heading: 'The Generative AI Challenge',
        paragraphs: [
          'The 2025 AI Watch Forum convened over 200 policymakers, technologists, and civil society leaders to address the governance challenges posed by generative AI in Africa. As ChatGPT, Gemini, and other large language models become embedded in African businesses, education systems, and government services, the need for appropriate governance frameworks has become urgent.',
          'Participants noted that generative AI presents both amplified versions of existing AI governance challenges — bias, privacy, accountability — and entirely new ones, including synthetic media, automated disinformation, and the environmental costs of training large models.',
        ],
      },
      {
        heading: 'Key Recommendations',
        paragraphs: [
          'The forum produced a set of recommendations organized around three pillars: protection, participation, and promotion. Protection measures include mandatory disclosure requirements for AI-generated content, sector-specific deployment guidelines (particularly for healthcare and education), and liability frameworks for AI-generated harms.',
          'Participation measures focus on ensuring African voices in global AI governance — including representation in standards bodies, participation in model development and evaluation, and African-language benchmarks for evaluating large language model performance. Promotion measures include public investment in AI research infrastructure, startup support programs, and AI literacy initiatives.',
        ],
      },
      {
        heading: 'Moving from Discussion to Action',
        paragraphs: [
          'Perhaps the most significant outcome was the commitment from seven African governments to establish AI regulatory sandboxes — controlled environments where companies can test AI applications under regulatory supervision before full deployment. These sandboxes will allow regulators to learn about the technology while developing evidence-based regulations.',
          'The forum also launched the African AI Policy Observatory, a permanent research body that will track AI developments across the continent, publish regular governance assessments, and provide technical assistance to governments developing AI regulations. The Observatory will be hosted at the African Union and supported by contributions from member states.',
        ],
      },
    ]),
  },
]

const categoryNames = ['AI Policy', 'Ethics', 'Digital Rights', 'Research', 'Governance']

async function seedArticles() {
  console.log('🌱 Seeding Beyond AI articles...\n')

  const payload = await getPayload({ config })

  // Create categories
  console.log('Creating categories...')
  const categoryMap: Record<string, number> = {}
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap[name] = existing.docs[0]!.id
      console.log(`  ✓ Category "${name}" already exists`)
    } else {
      const cat = await payload.create({
        collection: 'categories',
        data: { title: name, slug },
      })
      categoryMap[name] = cat.id
      console.log(`  + Created category "${name}"`)
    }
  }

  // Find or create author
  console.log('\nChecking for author...')
  const users = await payload.find({
    collection: 'users',
    limit: 1,
  })

  let authorId: number
  if (users.docs.length > 0) {
    authorId = users.docs[0]!.id
    console.log(`  ✓ Using existing user: ${users.docs[0]!.name || users.docs[0]!.email}`)
  } else {
    const author = await payload.create({
      collection: 'users',
      data: {
        name: 'Beyond AI Editorial',
        email: 'editorial@beyondai.org',
        password: 'password123!',
      },
    })
    authorId = author.id
    console.log(`  + Created author: Beyond AI Editorial`)
  }

  // Create articles
  console.log('\nCreating articles...')
  const createdPosts: { id: number; title: string }[] = []

  for (const article of articles) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⏭ "${article.title}" already exists, skipping`)
      createdPosts.push({ id: existing.docs[0]!.id, title: article.title })
      continue
    }

    const categoryId = categoryMap[article.categoryTitle]

    const post = await payload.create({
      collection: 'posts',
      data: {
        title: article.title,
        slug: article.slug,
        _status: 'published',
        articleType: article.articleType,
        featured: article.featured,
        authors: [authorId],
        categories: categoryId ? [categoryId] : [],
        content: article.content as any,
        publishedAt: new Date(
          Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        meta: {
          title: article.title,
          description: article.metaDescription,
        },
      },
      context: {
        disableRevalidate: true,
      },
    })

    createdPosts.push({ id: post.id, title: article.title })
    console.log(`  + Created "${article.title}"`)
  }

  // Set related posts (each post gets 2 random related posts)
  console.log('\nSetting related posts...')
  for (const post of createdPosts) {
    const others = createdPosts.filter((p) => p.id !== post.id)
    const shuffled = others.sort(() => Math.random() - 0.5)
    const related = shuffled.slice(0, 2).map((p) => p.id)

    await payload.update({
      id: post.id,
      collection: 'posts',
      data: { relatedPosts: related },
      context: { disableRevalidate: true },
    })
  }
  console.log('  ✓ Related posts set')

  console.log(`\n✅ Done! Created ${createdPosts.length} articles across ${categoryNames.length} categories.\n`)
  console.log('Visit /posts to see them.')

  process.exit(0)
}

seedArticles().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
