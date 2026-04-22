import type { Block } from 'payload'

export const TestimonialList: Block = {
  slug: 'testimonialList',
  interfaceName: 'TestimonialListBlock',
  labels: { singular: 'Testimonial List', plural: 'Testimonial Lists' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
