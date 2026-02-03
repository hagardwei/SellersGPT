/**
 * This file serves as the definitive schema reference for the AI pipeline.
 * Each variable corresponds to a Payload CMS block configuration.
 */

const SharedSettings = {
    theme: 'light | dark | brand',
    padding: {
        top: 'none | small | medium | large',
        bottom: 'none | small | medium | large',
    },
    visibility: 'both | desktop | mobile',
}

const SharedLink = {
    type: 'reference | custom',
    label: 'string (text on the button)',
    newTab: 'boolean',
    url: 'string (if type is custom)',
    reference: 'relationship to pages/posts (if type is reference)',
    appearance: 'default | outline',
}

export const HeroSchema = {
    slug: 'hero',
    description: 'Top-of-the-page visual section. Variants: simple (text only), media (text + background), split (text side-by-side with media).',
    fields: {
        variant: 'simple | media | split',
        title: 'string (max 60 chars)',
        subTitle: 'string (max 200 chars)',
        links: 'Array of SharedLink (max 1)',
        media: 'upload (media ID, required for media/split variants)',
    },
}

export const FeatureGridSchema = {
    slug: 'featureGrid',
    description: 'A grid of features with icons and descriptions.',
    fields: {
        heading: 'string',
        subheading: 'string',
        items: 'Array of { icon: upload, title: string, description: textarea }',
        columns: '2 | 3 | 4',
        settings: SharedSettings,
    },
}

export const ContentSchema = {
    slug: 'content',
    description: 'Flexible block for layout and rich text columns.',
    fields: {
        columns: 'Array of { size: oneThird | half | twoThirds | full, richText: LexicalJSON, enableLink: boolean, link: SharedLink }',
    },
}

export const TestimonialsSchema = {
    slug: 'testimonials',
    description: 'Display customer quotes and headshots.',
    fields: {
        heading: 'string',
        testimonials: 'Array of { quote: textarea, author: string, role: string, company: string, image: upload }',
        settings: SharedSettings,
    },
}

export const CallToActionSchema = {
    slug: 'cta',
    description: 'A dedicated block to drive user action with rich text and buttons.',
    fields: {
        richText: 'LexicalJSON',
        links: 'Array of SharedLink (max 2)',
    },
}

export const FAQSchema = {
    slug: 'faq',
    description: 'Accordion style frequently asked questions.',
    fields: {
        heading: 'string',
        questions: 'Array of { question: string, answer: LexicalJSON }',
    },
}

export const GallerySchema = {
    slug: 'gallery',
    description: 'Thumbnail grid of images.',
    fields: {
        heading: 'string',
        images: 'Array of { image: upload (required), caption: string }',
        columns: '2 | 3 | 4',
        settings: SharedSettings,
    },
}

export const StatsSchema = {
    slug: 'stats',
    description: 'Highlight key metrics or numbers.',
    fields: {
        heading: 'string',
        stats: 'Array of { value: string (e.g. "10k+"), label: string, description: string }',
    },
}

export const SplitSchema = {
    slug: 'split',
    description: 'Rich text content side-by-side with large media.',
    fields: {
        title: 'string',
        richText: 'LexicalJSON',
        media: 'upload (required)',
        mediaPosition: 'left | right',
        links: 'Array of SharedLink (max 2)',
        settings: SharedSettings,
    },
}

export const LogoCloudSchema = {
    slug: 'logoCloud',
    description: 'Grid of logos showing partners or clients.',
    fields: {
        heading: 'string',
        logos: 'Array of { logo: upload (required), name: string }',
        settings: SharedSettings,
    },
}

export const TimelineSchema = {
    slug: 'timeline',
    description: 'Vertical or horizontal sequence of events.',
    fields: {
        heading: 'string',
        steps: 'Array of { date: string, title: string, description: textarea }',
    },
}

export const VideoSchema = {
    slug: 'video',
    description: 'Full width or contained video player.',
    fields: {
        title: 'string',
        videoType: 'youtube | vimeo | selfHosted',
        url: 'string (URL for YouTube/Vimeo or Direct link)',
        thumbnail: 'upload (optional, used for self-hosted)',
        aspectRatio: '16:9 | 4:3 | 1:1',
    },
}

export const ArchiveSchema = {
    slug: 'archive',
    description: 'Dynamically list items from a collection (posts/categories).',
    fields: {
        introContent: 'LexicalJSON',
        populateBy: 'collection | selection',
        relationTo: 'posts (required if populateBy is collection)',
        categories: 'Array of relationship to categories',
        limit: 'number (default 10)',
        selectedDocs: 'Array of relationship to posts (if populateBy is selection)',
    },
}

export const MediaBlockSchema = {
    slug: 'mediaBlock',
    description: 'Simple full-width or contained image/video.',
    fields: {
        media: 'upload (required)',
    },
}

export const FormBlockSchema = {
    slug: 'formBlock',
    description: 'Insert a pre-defined form (contact, signup, etc). If the form does not exist, you can define it here using formTitle and formFields.',
    fields: {
        form: 'relationship to forms (slug of existing form)',
        formTitle: 'string (Only if form does not exist)',
        formFields: 'Array of { blockType: text | textarea | select | email | checkbox | message, name: string, label: string, required: boolean, options: Array of { label, value } (for select) } (Only if form does not exist)',
        enableIntro: 'boolean',
        introContent: 'LexicalJSON',
    },
}

/** 
 * Comprehensive array of all available blocks for the AI structure planner.
 */
export const AllBlocks = [
    HeroSchema,
    FeatureGridSchema,
    ContentSchema,
    TestimonialsSchema,
    CallToActionSchema,
    FAQSchema,
    GallerySchema,
    StatsSchema,
    SplitSchema,
    LogoCloudSchema,
    TimelineSchema,
    VideoSchema,
    ArchiveSchema,
    MediaBlockSchema,
    FormBlockSchema,
]
