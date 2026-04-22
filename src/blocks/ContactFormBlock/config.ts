import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlockType',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', defaultValue: "Let's Start A Conversation" },
    { name: 'subheading', type: 'textarea' },
  ],
}
