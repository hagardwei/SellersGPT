'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type TranslationContextType = {
    availableLanguages: string[] | null
    setAvailableLanguages: (langs: string[] | null) => void
}

const TranslationContext = createContext<TranslationContextType>({
    availableLanguages: null,
    setAvailableLanguages: () => { },
})

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [availableLanguages, setAvailableLanguages] = useState<string[] | null>(null)

    return (
        <TranslationContext.Provider value={{ availableLanguages, setAvailableLanguages }}>
            {children}
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => useContext(TranslationContext)
