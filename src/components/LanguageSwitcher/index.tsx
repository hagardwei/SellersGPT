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

const languages = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Français', value: 'fr' },
    { label: 'Português', value: 'pt' },
    { label: 'Italiano', value: 'it' },
    { label: 'Türkçe', value: 'tr' },
    { label: 'Русский', value: 'ru' },
    { label: 'Nederlands', value: 'nl' },
]

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    const pathname = usePathname()
    const router = useRouter()

    // pathname is like /en/about or /es/search
    const segments = pathname.split('/')
    const currentLang = segments[1] || 'en'

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
                <SelectTrigger className="w-[130px] h-9 bg-transparent border-none focus:ring-0">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
