import type { Field, GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

const COLOR_VALUE_PATTERN = /^(oklch|hsl|hsla|rgb|rgba|lab|lch|color)\(.+\)$|^#[0-9a-fA-F]{3,8}$/

const colorField = (name: string, label: string, defaultValue: string): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    description: 'OKLCH, HSL, RGB, or hex. Example: oklch(82% 0.17 85deg) or #ffcc00',
  },
  validate: (value: unknown) => {
    if (value == null || value === '') return true
    if (typeof value !== 'string') return 'Color must be a string.'
    return COLOR_VALUE_PATTERN.test(value.trim()) ? true : 'Must be a valid CSS color (oklch/hsl/rgb/hex).'
  },
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
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
          label: 'Branding',
          fields: [
            {
              name: 'branding',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Used in the header and footer. Uploaded file replaces /logo.png.',
                  },
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Optional. Used on dark sections (e.g. header with bg-dark). Falls back to primary logo if empty.',
                  },
                },
                {
                  name: 'logoHeight',
                  type: 'number',
                  min: 24,
                  max: 96,
                  defaultValue: 56,
                  admin: {
                    description: 'Desktop logo height in pixels (mobile auto-scales to ~70%).',
                  },
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional. Replaces the default favicon. Accepts .ico, .svg, or .png.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Theme',
          description: 'Colors, typography, and layout tokens. Changes apply site-wide.',
          fields: [
            {
              name: 'theme',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'colors',
                  type: 'group',
                  label: 'Colors',
                  fields: [
                    colorField('background', 'Background', 'oklch(100% 0 0deg)'),
                    colorField('foreground', 'Foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('dark', 'Dark surface', 'oklch(100% 0 0deg)'),
                    colorField('darkForeground', 'Dark foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('card', 'Card', 'oklch(97% 0.005 260deg)'),
                    colorField('cardForeground', 'Card foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('popover', 'Popover', 'oklch(100% 0 0deg)'),
                    colorField('popoverForeground', 'Popover foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('primary', 'Primary', 'oklch(82% 0.17 85deg)'),
                    colorField('primaryForeground', 'Primary foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('primaryDeep', 'Primary (deep)', 'oklch(58% 0.15 78deg)'),
                    colorField('secondary', 'Secondary', 'oklch(96.5% 0.005 260deg)'),
                    colorField('secondaryForeground', 'Secondary foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('muted', 'Muted', 'oklch(96.5% 0.005 260deg)'),
                    colorField('mutedForeground', 'Muted foreground', 'oklch(55% 0.01 260deg)'),
                    colorField('accent', 'Accent', 'oklch(96.5% 0.005 260deg)'),
                    colorField('accentForeground', 'Accent foreground', 'oklch(16.5% 0.02 260deg)'),
                    colorField('destructive', 'Destructive', 'oklch(57.7% 0.245 27.325deg)'),
                    colorField('destructiveForeground', 'Destructive foreground', 'oklch(100% 0 0deg)'),
                    colorField('border', 'Border', 'oklch(92% 0.005 260deg)'),
                    colorField('input', 'Input border', 'oklch(92% 0.005 260deg)'),
                    colorField('ring', 'Focus ring', 'oklch(82% 0.17 85deg)'),
                  ],
                },
                {
                  name: 'typography',
                  type: 'group',
                  label: 'Typography',
                  fields: [
                    {
                      name: 'fontSans',
                      type: 'select',
                      defaultValue: 'sora',
                      options: [
                        { label: 'Sora', value: 'sora' },
                        { label: 'Inter', value: 'inter' },
                        { label: 'Manrope', value: 'manrope' },
                        { label: 'DM Sans', value: 'dm-sans' },
                        { label: 'Space Grotesk', value: 'space-grotesk' },
                        { label: 'IBM Plex Sans', value: 'ibm-plex-sans' },
                      ],
                    },
                    {
                      name: 'fontMono',
                      type: 'select',
                      defaultValue: 'space-mono',
                      options: [
                        { label: 'Space Mono', value: 'space-mono' },
                        { label: 'JetBrains Mono', value: 'jetbrains-mono' },
                        { label: 'IBM Plex Mono', value: 'ibm-plex-mono' },
                      ],
                    },
                  ],
                },
                {
                  name: 'layout',
                  type: 'group',
                  label: 'Layout',
                  fields: [
                    {
                      name: 'radius',
                      type: 'number',
                      min: 0,
                      max: 24,
                      defaultValue: 0,
                      admin: { description: 'Border radius in pixels. 0 = sharp corners.' },
                    },
                    {
                      name: 'containerMaxWidth',
                      type: 'number',
                      min: 960,
                      max: 1920,
                      defaultValue: 1376,
                      admin: { description: 'Maximum container width in pixels at lg breakpoint and above.' },
                    },
                  ],
                },
              ],
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
