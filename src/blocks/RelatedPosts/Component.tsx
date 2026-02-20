import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import RichText from '@/components/RichText'
import { Card } from '@/components/Card'
import type { Post, RelatedPostsBlock as RelatedPostsProps } from '@/payload-types'

export const RelatedPosts: React.FC<RelatedPostsProps> = async (props) => {
  const { introContent, title, limit = 3 } = props

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    limit,
    sort: '-publishedAt',
    where: {
        _status: {
            equals: 'published'
        }
    }
  })

  if (!posts.docs.length) return null

  return (
    <div className="container my-16">
      {title && (
        <div className="prose dark:prose-invert mb-8">
          <h3 className="text-3xl font-bold">{title}</h3>
        </div>
      )}
      {introContent && (
        <div className="prose dark:prose-invert mb-12">
           <RichText data={introContent} enableGutter={false} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {posts.docs.map((doc, index) => {
          return <Card key={index} doc={doc as Post} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
