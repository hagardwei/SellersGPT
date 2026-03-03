import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminAuthenticated } from '@/access/adminAuthenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: adminAuthenticated,
    delete: adminAuthenticated,
    read: adminAuthenticated,
    update: adminAuthenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
    },
    {
      name: 'socialConnect',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/SocialConnectButtons#default',
        },
      },
    },
    {
      name: 'socialAccounts',
      label: 'Linked Social Acounts',
      type: 'array',
      admin :{
        description: 'Manage connected social media accounts for automation. ',
      },
      fields: [
        {
          name: 'platform', 
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter/X', value: 'twitter' },
          ],
        },
        { name: 'username', type: 'text', admin: { description: 'Username or display Name on the platform' }},
        { name: 'providerUserId', type: 'text', admin: { readOnly: true } },
        { name: 'accessToken', type: 'text', admin: { readOnly: true } },
        { name: 'refreshToken', type: 'text', admin: { readOnly: true } },
        { name: 'expiresAt', type: 'date', admin: { readOnly: true } },
        { name: 'scope', type: 'text', admin: { readOnly: true } },
        { name: 'isActive', type: 'checkbox', admin: { readOnly: true } },
      ]
    }
  ],
  timestamps: true,
}
