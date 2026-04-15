import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              defaultValue: 'Beyond AI',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              defaultValue:
                'Beyond AI is a civic platform for AI governance and digital transformation in Africa.',
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Email Address',
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Phone Number',
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Address',
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                {
                  name: 'twitter',
                  type: 'text',
                  label: 'Twitter / X URL',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn URL',
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram URL',
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: 'YouTube URL',
                },
                {
                  name: 'facebook',
                  type: 'text',
                  label: 'Facebook URL',
                },
              ],
            },
          ],
        },
        {
          label: 'Integrations',
          fields: [
            {
              name: 'mailchimpAudienceId',
              type: 'text',
              label: 'Mailchimp Audience ID',
              admin: {
                description:
                  'Can also be set via MAILCHIMP_AUDIENCE_ID environment variable. This field overrides the env var.',
              },
            },
          ],
        },
      ],
    },
  ],
}
