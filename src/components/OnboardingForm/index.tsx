'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './index.scss'

const WebsiteInfoForm: React.FC = () => {
    const [formData, setFormData] = useState({
        websiteName: '',
        industry: '',
        description: '',
        goal: 'lead-generation',
        referenceWebsite: '',
        targetAudience: '',
        services: '',
        brandTone: 'professional',
    })
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/globals/website-info')
                if (response.ok) {
                    const data = await response.json()
                    if (data.isCompleted) {
                        setIsCompleted(true)
                    } else {
                        setFormData({
                            websiteName: data.websiteName || '',
                            industry: data.industry || '',
                            description: data.description || '',
                            goal: data.goal || 'lead-generation',
                            referenceWebsite: data.referenceWebsite || '',
                            targetAudience: data.targetAudience || '',
                            services: data.services || '',
                            brandTone: data.brandTone || 'professional',
                        })
                    }
                }
            } catch (err) {
                console.error('Failed to fetch website info', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/globals/website-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    isCompleted: true,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setIsCompleted(true)

                // Trigger AI generation
                await fetch('/api/globals/website-info/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })

                router.refresh()
            } else {
                const errData = await response.json()
                setError(errData.errors?.[0]?.message || 'Failed to save information')
            }
        } catch (err) {
            console.error('Failed to submit form', err)
            setError('An unexpected error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || isCompleted) return null

    return (
        <div className="onboarding-form">
            <div className="onboarding-form__header">
                <h2>Welcome to SellerGPT!</h2>
                <p>Please provide some details about your business to help us personalize your experience.</p>
            </div>

            <form className="onboarding-form__form" onSubmit={handleSubmit}>
                <div className="field-group">
                    <label htmlFor="websiteName">Website / Brand Name *</label>
                    <input
                        id="websiteName"
                        name="websiteName"
                        value={formData.websiteName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div className="field-group">
                    <label htmlFor="industry">Industry / Business Type *</label>
                    <input
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Manufacturing, SaaS"
                    />
                </div>

                <div className="field-group field-description">
                    <label htmlFor="description">Short Business Description (2-4 lines) *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="What do you do and for whom?"
                    />
                </div>

                <div className="field-group">
                    <label htmlFor="goal">Primary Goal of Website *</label>
                    <select id="goal" name="goal" value={formData.goal} onChange={handleChange} required>
                        <option value="lead-generation">Lead generation</option>
                        <option value="product-showcase">Product showcase</option>
                        <option value="company-profile">Company profile</option>
                        <option value="services">Services</option>
                    </select>
                </div>

                <div className="field-group">
                    <label htmlFor="brandTone">Brand Tone *</label>
                    <select
                        id="brandTone"
                        name="brandTone"
                        value={formData.brandTone}
                        onChange={handleChange}
                        required
                    >
                        <option value="professional">Professional</option>
                        <option value="corporate">Corporate</option>
                        <option value="friendly">Friendly</option>
                        <option value="technical">Technical</option>
                        <option value="marketing-heavy">Marketing-heavy</option>
                    </select>
                </div>

                <div className="field-group field-audience">
                    <label htmlFor="targetAudience">Target Audience *</label>
                    <input
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        required
                        placeholder="e.g. B2B manufacturers, enterprise buyers"
                    />
                </div>

                <div className="field-group field-services">
                    <label htmlFor="services">Key Services / Offerings (comma separated) *</label>
                    <input
                        id="services"
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Consulting, Software, Maintenance"
                    />
                </div>

                <div className="field-group">
                    <label htmlFor="referenceWebsite">Reference Website (optional)</label>
                    <input
                        id="referenceWebsite"
                        name="referenceWebsite"
                        value={formData.referenceWebsite}
                        onChange={handleChange}
                        placeholder="https://example.com"
                    />
                </div>

                <div className="onboarding-form__footer">
                    {error && <span className="error-message">{error}</span>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Complete Setup'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default WebsiteInfoForm
