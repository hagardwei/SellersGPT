'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useParams } from 'next/navigation'

export const Search: React.FC<{ placeholder?: string }> = ({ placeholder = 'Search' }) => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const { lang } = useParams()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(`/${lang}/search${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, router, lang])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {placeholder}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={placeholder}
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
