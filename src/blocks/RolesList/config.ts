import type { Block } from 'payload'

export const RolesList: Block = {
  slug: 'rolesList',
  interfaceName: 'RolesListBlock',
  labels: { singular: 'Roles List', plural: 'Roles Lists' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'roles',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'commitment', type: 'text', admin: { description: 'e.g. "4-6 hrs / month"' } },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'skills',
          type: 'array',
          fields: [{ name: 'skill', type: 'text', required: true }],
        },
      ],
    },
  ],
}
