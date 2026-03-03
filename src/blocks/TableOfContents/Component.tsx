'use client'

import React, { useEffect, useState } from 'react'

interface TableOfContentsProps {
  heading?: string
}

export const TableOfContentsBlock: React.FC<TableOfContentsProps> = ({ heading }) => {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2, h3, h4'))
      .map((el) => {
        if (!el.id) {
            el.id = el.textContent?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9)
        }
        return {
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName.replace('H', ''), 10),
        }
      })
    setHeadings(elements)
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="container my-16 bg-card p-8 rounded-lg border border-border shadow-sm">
      <h3 className="text-xl font-bold mb-6">{heading || 'On this page'}</h3>
      <nav>
        <ul className="space-y-3">
          {headings.map((h, i) => (
            <li
              key={i}
              className="transition-colors hover:text-primary"
              style={{ marginLeft: `${(h.level - 2) * 1.5}rem` }}
            >
              <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
