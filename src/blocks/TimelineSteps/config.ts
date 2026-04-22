import type { Block } from 'payload'

export const TimelineSteps: Block = {
  slug: 'timelineSteps',
  interfaceName: 'TimelineStepsBlock',
  labels: { singular: 'Timeline Steps', plural: 'Timeline Steps' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
