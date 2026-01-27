'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/providers/Translation'

export const TranslationSetter: React.FC<{ languages: string[] | null }> = ({ languages }) => {
    const { setAvailableLanguages } = useTranslation()

    useEffect(() => {
        setAvailableLanguages(languages)
        // Cleanup on unmount (navigation)
        return () => setAvailableLanguages(null)
    }, [languages, setAvailableLanguages])

    return null
}
