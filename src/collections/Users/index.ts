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
    }
  ],
  timestamps: true,
}
