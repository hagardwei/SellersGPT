import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { AIJobs } from './collections/AIJobs'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { WebsiteInfo } from './globals/WebsiteInfo/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Translations } from './collections/Translations'
import { BulkKeyWordUploads } from './collections/BulkKeyWordUploads'
import { Leads } from "./collections/Leads"
import { ChatbotSettings } from './globals/ChatbotSettings/config'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { NewsRaw } from './collections/NewRaw'
import { IndustryNewsSettings } from './globals/IndustryNewsSettings/config'
import { newsAutomationTask } from './tasks/newsAutomation'
import { SocialPosts } from './collections/SocialPosts'
import { NewsSources } from './collections/NewsSources'
import { weeklySocialDigestTask } from './tasks/weeklySocialDigest'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    autoRefresh: true,
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/OnboardingForm'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Header, Footer, AIJobs, Translations, BulkKeyWordUploads, Leads, NewsRaw, SocialPosts, NewsSources],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [WebsiteInfo, ChatbotSettings, IndustryNewsSettings],
  
  email: process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: 'info@payloadcms.com',
      defaultFromName: 'Payload',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined,
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    tasks: [newsAutomationTask, weeklySocialDigestTask],
    autoRun: [
      {
        cron: '*/5 * * * *', // Check for scheduled tasks every 5 minutes
      },
    ],
  },
})
