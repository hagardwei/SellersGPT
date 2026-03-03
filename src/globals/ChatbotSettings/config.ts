import { authenticated } from "@/access/authenticated";
import { GlobalConfig } from "payload";

export const ChatbotSettings: GlobalConfig = {
    slug: 'chatbot-settings',
    access: {
        read: () => true,
        update: authenticated
    },
    admin: {
        group: 'Settings',
    },
    fields: [
        {
            name: 'enabled',
            type: 'checkbox',
            label: 'Enable Chatbot',
            defaultValue: false,
        },
        {
            name: 'welcomeMessage',
            type: 'text',
            label: 'Welcome Message',
            defaultValue: 'Hello! How can I help you today',
        },
        {
            name: 'calendlyLink',
            type: 'text',
            label: 'Calendly Link',
            admin: {
                description: 'Link to your Calendly page for scheduling meetings', 
            },
        },
        {
            name: 'emailNotifications',
            type: 'checkbox',
            label: 'Enable Email Notifications for Leads',
            defaultValue: true,
        },
    ],
}