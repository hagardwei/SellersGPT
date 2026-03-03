'use client'

import { useDocumentInfo } from "@payloadcms/ui"

const SocialConnectButtons: React.FC = () => {
    const { id } = useDocumentInfo()

    const handleConnect = (platform: string) => {
        const userId = id
        if (!userId) {
            alert('User ID not found. Please save the user first.')
            return   
        }
        window.location.href = `/api/social/auth/${platform}?userId=${userId}`
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <h4>Connect Social Accounts</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                    type="button"
                    onClick={() => handleConnect('linkedin')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0077b5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Connect LinkedIn
                </button>
                <button
                    type="button"
                    onClick={() => handleConnect('facebook')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1877f2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Connect Facebook
                </button>
                <button
                    type="button"
                    onClick={() => handleConnect('twitter')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#000000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Connect X (Twitter)
                </button>
            </div>
        </div>
    )
}

export default SocialConnectButtons