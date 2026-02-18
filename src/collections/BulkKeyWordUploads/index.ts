import { adminAuthenticated } from "@/access/adminAuthenticated";
import { authenticated } from "@/access/authenticated";
import { CollectionConfig } from "payload";
import { triggerParentJob } from "./hooks/triggerParentJob";

export const BulkKeyWordUploads: CollectionConfig = {
    slug: 'bulk-keyword-uploads',
    labels: {
        singular: 'Bulk Keyword Upload',
        plural: 'Bulk Keyword Uploads',
    },
    admin: {
        defaultColumns: ["file", "status", "totalKeywords", "processedKeywords", "createdAt"],
        useAsTitle: 'fileName',
    },
    access: {
        read: authenticated,
        create: adminAuthenticated,
        update: adminAuthenticated,
        delete: adminAuthenticated,
    },
    fields: [
        {
            name: 'file',
            label: 'CSV/XLSX File',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'fileName',
            label: 'File Name',
            type: 'text',
            admin: { readOnly: true }
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Failed', value: 'failed' },
            ],
            defaultValue: 'pending'
        },
        {
            name: 'totalKeywords',
            label: 'Total Keywords',
            type: 'number',
            admin: {readOnly: true}
        },
        {
            name: 'processedKeywords',
            label: 'Processed Keywords',
            type: 'number',
            defaultValue: 0,
            admin: { readOnly: true },
        },
        {
            name: 'parentJobId',
            label: 'Parent AI Job Id',
            type: 'text',
            admin: { readOnly: true },
        },
    ],

    hooks: {
        afterChange: [triggerParentJob],
      },
};

