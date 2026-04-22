import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SplitContentBlock } from '@/blocks/SplitContent/Component'
import { StatementSectionBlock } from '@/blocks/StatementSection/Component'
import { ObjectivesGridBlock } from '@/blocks/ObjectivesGrid/Component'
import { ProgramsGridBlock } from '@/blocks/ProgramsGrid/Component'
import { StatsRowBlock } from '@/blocks/StatsRow/Component'
import { TimelineStepsBlock } from '@/blocks/TimelineSteps/Component'
import { RolesListBlock } from '@/blocks/RolesList/Component'
import { TestimonialListBlock } from '@/blocks/TestimonialList/Component'
import { FAQBlockComponent } from '@/blocks/FAQBlock/Component'
import { ContactInfoBlockComponent } from '@/blocks/ContactInfoBlock/Component'
import { UpcomingEventsBlockComponent } from '@/blocks/UpcomingEventsBlock/Component'
import { FeaturedEventBlockComponent } from '@/blocks/FeaturedEventBlock/Component'
import { PastEventsBlockComponent } from '@/blocks/PastEventsBlock/Component'
import { LatestArticlesBlockComponent } from '@/blocks/LatestArticlesBlock/Component'
import { FeaturedSponsorsBlockComponent } from '@/blocks/FeaturedSponsorsBlock/Component'
import { NewsletterFormBlockComponent } from '@/blocks/NewsletterFormBlock/Component'
import { ContactFormBlockComponent } from '@/blocks/ContactFormBlock/Component'
import { VolunteerFormBlockComponent } from '@/blocks/VolunteerFormBlock/Component'
import { SponsorInquiryFormBlockComponent } from '@/blocks/SponsorInquiryFormBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  splitContent: SplitContentBlock,
  statementSection: StatementSectionBlock,
  objectivesGrid: ObjectivesGridBlock,
  programsGrid: ProgramsGridBlock,
  statsRow: StatsRowBlock,
  timelineSteps: TimelineStepsBlock,
  rolesList: RolesListBlock,
  testimonialList: TestimonialListBlock,
  faqBlock: FAQBlockComponent,
  contactInfo: ContactInfoBlockComponent,
  upcomingEvents: UpcomingEventsBlockComponent,
  featuredEvent: FeaturedEventBlockComponent,
  pastEvents: PastEventsBlockComponent,
  latestArticles: LatestArticlesBlockComponent,
  featuredSponsors: FeaturedSponsorsBlockComponent,
  newsletterForm: NewsletterFormBlockComponent,
  contactForm: ContactFormBlockComponent,
  volunteerForm: VolunteerFormBlockComponent,
  sponsorInquiryForm: SponsorInquiryFormBlockComponent,
}

const WRAPPED_BLOCKS = new Set([
  'archive',
  'content',
  'cta',
  'formBlock',
  'mediaBlock',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              const needsWrapper = WRAPPED_BLOCKS.has(blockType)
              const content = (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} disableInnerContainer />
              )
              return needsWrapper ? (
                <div className="my-16" key={index}>
                  {content}
                </div>
              ) : (
                <Fragment key={index}>{content}</Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
