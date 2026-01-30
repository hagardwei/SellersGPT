'use client'
import React from 'react'
import { UIField } from 'payload'
import { useDocumentInfo, useField } from '@payloadcms/ui'
import './index.scss'

export const AIJobActions: React.FC<UIField> = () => {
    const { id } = useDocumentInfo()
    const { value: status } = useField<string>({ path: 'status' })

    const handleRun = async () => {
        try {
            const res = await fetch(`/api/ai-jobs/${id}/run`, { method: 'POST' })
            const result = await res.json()
            if (result.success) {
                window.location.reload()
            } else {
                alert('Failed to run job: ' + result.error)
            }
        } catch (err) {
            alert('Error: ' + err)
        }
    }

    const handleCancel = async () => {
        try {
            const res = await fetch(`/api/ai-jobs/${id}/cancel`, { method: 'POST' })
            const result = await res.json()
            if (result.success) {
                window.location.reload()
            } else {
                alert('Failed to cancel job: ' + result.error)
            }
        } catch (err) {
            alert('Error: ' + err)
        }
    }

    return (
        <div className="ai-job-actions">
            <div className="ai-job-actions__label">Execution Controls</div>
            <div className="ai-job-actions__buttons">
                {(status === 'pending' || status === 'failed' || status === 'completed') && (
                    <button
                        type="button"
                        className="ai-job-actions__btn ai-job-actions__btn--run"
                        onClick={handleRun}
                    >
                        {status === 'completed' ? 'Rerun' : 'Run'}
                    </button>
                )}
                {status === 'running' && (
                    <button
                        type="button"
                        className="ai-job-actions__btn ai-job-actions__btn--cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}
