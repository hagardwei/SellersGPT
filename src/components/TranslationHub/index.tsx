'use client'
import React, { useEffect, useState } from 'react'
import { useDocumentInfo, useField } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

const languages = [
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

export const TranslationHub: React.FC = () => {
    const { id, collectionSlug } = useDocumentInfo()
    const { value: groupId } = useField<string>({ path: 'translation_group_id' })
    const { value: currentLang } = useField<string>({ path: 'language' })
    const [variants, setVariants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [cloning, setCloning] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

    const fetchVariants = async () => {
        if (!groupId || !collectionSlug) return
        setLoading(true)
        try {
            const response = await fetch(`/api/${collectionSlug}?where[translation_group_id][equals]=${groupId}&limit=20&depth=0`)
            const data = await response.json()
            setVariants(data.docs || [])
        } catch (err) {
            console.error('Failed to fetch translation variants', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVariants()
    }, [groupId, collectionSlug, id])

    const handleClone = async (targetLang: string) => {
        if (!id || !collectionSlug) return
        setCloning(targetLang)
        try {
            const response = await fetch(`/api/${collectionSlug}/${id}/clone-to?newLang=${targetLang}`, {
                method: 'POST',
            })
            if (response.ok) {
                const newDoc = await response.json()
                await fetchVariants()
                router.push(`/admin/collections/${collectionSlug}/${newDoc.id}`)
            } else {
                const errData = await response.json()
                alert(`Error: ${errData.error || 'Failed to create translation'}`)
            }
        } catch (err) {
            console.error('Clone failed', err)
            alert('Clone failed')
        } finally {
            setCloning(null)
        }
    }

    const handleDeleteGroup = async () => {
        if (!id || !collectionSlug) return
        if (!confirm('Are you sure you want to delete the ENTIRE translation group? This cannot be undone.')) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/${collectionSlug}/${id}/delete-group`, {
                method: 'POST',
            })
            if (response.ok) {
                alert('Translation group deleted successfully.')
                router.push(`/admin/collections/${collectionSlug}`)
            } else {
                const errData = await response.json()
                alert(`Error: ${errData.error || 'Failed to delete translation group'}`)
            }
        } catch (err) {
            console.error('Delete failed', err)
            alert('Delete failed')
        } finally {
            setDeleting(false)
        }
    }

    if (!groupId) return null

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'var(--theme-bg-soft)' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Translation Hub</h4>
            {loading ? (
                <p style={{ fontSize: '12px' }}>Loading variants...</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {languages.map((lang) => {
                        const variant = variants.find((v) => v.language === lang.value)
                        const isCurrent = currentLang === lang.value

                        let statusColor = '#ccc' // Missing

                        if (variant) {
                            statusColor = variant._status === 'published' ? '#2ecc71' : '#f39c12'
                        }

                        return (
                            <li key={lang.value} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--theme-elevation-100)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: statusColor
                                    }} />
                                    <span style={{ fontSize: '13px', fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                        {lang.label} {isCurrent && '(Current)'}
                                    </span>
                                </div>
                                <div>
                                    {variant ? (
                                        !isCurrent && (
                                            <button
                                                onClick={() => router.push(`/admin/collections/${collectionSlug}/${variant.id}`)}
                                                style={{
                                                    padding: '2px 8px',
                                                    fontSize: '11px',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid var(--theme-elevation-200)',
                                                    borderRadius: '2px',
                                                    color: 'inherit'
                                                }}
                                            >
                                                View
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            disabled={!!cloning || deleting}
                                            onClick={() => handleClone(lang.value)}
                                            style={{
                                                padding: '2px 8px',
                                                fontSize: '11px',
                                                cursor: cloning ? 'not-allowed' : 'pointer',
                                                backgroundColor: 'var(--theme-success-500)',
                                                border: 'none',
                                                borderRadius: '2px',
                                                color: 'white',
                                                opacity: cloning ? 0.5 : 1
                                            }}
                                        >
                                            {cloning === lang.value ? 'Creating...' : '+ Translate'}
                                        </button>
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    disabled={deleting || !!cloning}
                    onClick={handleDeleteGroup}
                    style={{
                        padding: '6px',
                        fontSize: '11px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: 'bold'
                    }}
                >
                    {deleting ? 'Deleting Group...' : 'DELETE TRANSLATION GROUP'}
                </button>
                <div style={{ fontSize: '9px', opacity: 0.5, textAlign: 'center' }}>
                    Group ID: {groupId}
                </div>
            </div>
        </div>
    )
}
