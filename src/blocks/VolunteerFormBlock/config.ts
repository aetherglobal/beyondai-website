import type { Block } from 'payload'

export const VolunteerFormBlock: Block = {
  slug: 'volunteerForm',
  interfaceName: 'VolunteerFormBlockType',
  labels: { singular: 'Volunteer Form', plural: 'Volunteer Forms' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: 'Apply to Volunteer' },
    { name: 'subheading', type: 'textarea' },
  ],
}
