'use client'
import React, { useEffect, useState } from "react"
import './index.scss'

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
    const [input, setInput] = useState('')
    const [showLeadForm, setShowLeadForm] = useState(false)
    const [settings, setSettings] = useState<any>(null)
    const [leadData, setLeadData] = useState({name: '', email: '',company: '', need: '', message: '' })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/globals/chatbot-settings')
                if(response.ok){
                    const data = await response.json()
                    setSettings(data)
                    if(data.welcomeMessage){
                        setMessages([{ role: 'assistant' as const, content: data.welcomeMessage }])
                    }
                }
            } catch (error) {
                console.log('Error fetching chatbot settings:', error)
            }
        }
        fetchSettings()
    }, [])

    const handleSend = async () => {
        if(!input.trim()) return;
        const userMessage = { role: 'user', content: input }
        const newMessages: any  = [...messages, userMessage];
        setMessages(newMessages)
        setInput('')
        console.log("__________: ", newMessages)
        try {
            const response = await fetch('https://gg6avd6ii5qexvdgqrz3nr6b.agents.do-ai.run/api/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer Q_rsD94PZ-cPd85W34j_A9OFix8FBIOF` },
                body: JSON.stringify({
                    messages: newMessages
                })
            })

            if(response.ok) {
                const data = await response.json()
                setMessages([...newMessages, {role: 'assistant' as const, content: data.reply }])
                if(data.askForLead){
                    setShowLeadForm(true)
                }
            }
        } catch (err) {
            console.error('Error sending message:', err)
        }
    }

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/chat/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...leadData, transcript: messages }),
            })

            if(response.ok){
                setMessages([...messages, { role: 'assistant', 
                    content: 'Thank you! We will get back to you soon.' }])
                    setShowLeadForm(false)
            }
        } catch (err) {
            console.error('Lead Submission Error: ', err)
        }
    } 

    if(!settings?.enabled) return null;

    return (
        <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
            <button className='chatbot__toggle' onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="chatbot__window">
                    <div className="chatbot__header">
                        <h3>Assistant</h3>
                    </div>
                    <div className="chatbot__messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`chatbot__message chatbot__message--${m.role}`}>
                                {m.content}
                            </div>
                        ))}
                        {showLeadForm && (
                            <form className="chatbot__lead-form" onSubmit={handleLeadSubmit}>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    value={leadData.name}
                                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    required
                                    value={leadData.email}
                                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                                />
                                <input 
                                    type="text"
                                    placeholder="Your Company Name"
                                    required
                                    value={leadData.company}  
                                    onChange= {(e) => setLeadData({...leadData, company: e.target.value })}
                                />
                                <input 
                                    type="text"
                                    placeholder="You Need"
                                    required
                                    value={leadData.need}
                                    onChange={(e) => setLeadData({...leadData, need: e.target.value })}
                                />
                                <button type="submit">Contact Me</button>
                            </form>
                        )}
                    </div>
                    <div className="chatbot__input">
                        <input
                            type="text"
                            placeholder="Type Your Message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>➤</button>
                    </div>
                    {settings.calendlyLink && (
                        <div className="chatbot-footer">
                            <a href={settings.calendlyLink} target="_blank" rel="noopener noreferrer">
                                Schedule a Meeting
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}