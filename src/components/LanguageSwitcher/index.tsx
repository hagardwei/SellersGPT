'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utilities/ui'
import { useTranslation } from '@/providers/Translation'

const allLanguages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'German', value: 'de' },
    { label: 'French', value: 'fr' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Italian', value: 'it' },
    { label: 'Turkish', value: 'tr' },
    { label: 'Russian', value: 'ru' },
    { label: 'Dutch', value: 'nl' },
]

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    const pathname = usePathname()
    const router = useRouter()
    const { availableLanguages } = useTranslation()

    // pathname is like /en/about or /es/search
    const segments = pathname.split('/')
    const currentLang = segments[1] || 'en'

    // Filter languages if specific variants are set (e.g. for dynamic pages)
    const displayedLanguages = availableLanguages
        ? allLanguages.filter(lang => availableLanguages.includes(lang.value))
        : allLanguages

    const handleLanguageChange = (newLang: string) => {
        if (newLang === currentLang) return

        const newSegments = [...segments]
        newSegments[1] = newLang
        const newPath = newSegments.join('/') || '/'
        router.push(newPath)
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Select value={currentLang} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[130px] h-9 bg-transparent border-none focus:ring-0 text-foreground">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {displayedLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
