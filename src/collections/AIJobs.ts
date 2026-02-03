import type { CollectionConfig } from 'payload'
import { adminAuthenticated } from '../access/adminAuthenticated'
import { authenticated } from '../access/authenticated'

export const AIJobs: CollectionConfig = {
    slug: 'ai-jobs',
    admin: {
        useAsTitle: 'type',
        defaultColumns: ['type', 'status', 'step', 'createdAt'],
        group: 'AI',
    },
    access: {
        read: authenticated,
        create: adminAuthenticated,
        update: adminAuthenticated,
        delete: adminAuthenticated,
    },
    fields: [
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Generate Website', value: 'GENERATE_WEBSITE' },
                { label: 'Generate Page', value: 'GENERATE_PAGE' },
                { label: 'Regenerate Page', value: 'REGENERATE_PAGE' },
            ],
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            required: true,
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Running', value: 'running' },
                { label: 'Completed', value: 'completed' },
                { label: 'Failed', value: 'failed' },
            ],
        },
        {
            name: 'step',
            type: 'text',
            admin: {
                description: 'Current execution step (e.g. "INITIALIZATION", "PLANNING")',
            },
        },
        {
            name: 'prompt',
            type: 'textarea',
            label: 'AI Prompt Sent',
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },
        {
            name: 'actions',
            type: 'ui',
            label: 'Actions',
            admin: {
                position: 'sidebar',
                components: {
                    Field: '@/components/AIJobActions#AIJobActions',
                },
            },
        },
        {
            name: 'input_payload',
            type: 'json',
            admin: {
                description: 'Parameters passed to the AI (prompts, context, etc.)',
            },
        },
        {
            name: 'output_payload',
            type: 'json',
            admin: {
                description: 'Raw output or structured result from the AI',
            },
        },
        {
            name: 'error',
            type: 'json',
            admin: {
                description: 'Error details if the job failed',
            },
        },
        {
            name: 'skipped_blocks',
            type: 'json',
            admin: {
                description: 'List of blocks that were skipped due to validation errors',
            },
        },
        {
            name: 'retry_count',
            type: 'number',
            defaultValue: 0,
        },
        {
            name: 'parent_job',
            type: 'relationship',
            relationTo: 'ai-jobs',
            admin: {
                description: 'The website job that spawned this page job',
            },
        },
        {
            name: 'completed_at',
            type: 'date',
        },
    ],
    timestamps: true,
    endpoints: [
        {
            path: '/:id/run',
            method: 'post',
            handler: async (req) => {
                const { payload } = req
                const id = req.routeParams?.id as string

                try {
                    // Update status to pending to pick it up again
                    await payload.update({
                        collection: 'ai-jobs',
                        id,
                        data: {
                            status: 'pending',
                            error: null,
                        },
                    })

                    const { runAIJob } = await import('../utilities/ai/orchestrator')
                    runAIJob(id)

                    return Response.json({ success: true, message: 'Job started' })
                } catch (error: any) {
                    return Response.json({ success: false, error: error.message }, { status: 500 })
                }
            },
        },
        {
            path: '/:id/cancel',
            method: 'post',
            handler: async (req) => {
                const { payload } = req
                const id = req.routeParams?.id as string

                try {
                    await payload.update({
                        collection: 'ai-jobs',
                        id,
                        data: {
                            status: 'failed',
                            error: { message: 'Job cancelled by user' },
                        },
                    })

                    return Response.json({ success: true, message: 'Job cancelled' })
                } catch (error: any) {
                    return Response.json({ success: false, error: error.message }, { status: 500 })
                }
            },
        },
    ],
}
