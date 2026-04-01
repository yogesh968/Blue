import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatAssistant.css';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Welcome to BlueVitals! I'm here to help you get started. You can ask about your bookings or available services." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const patientId = localStorage.getItem('patientId');

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ message: inputValue, patientId })
            });

            const data = await response.json();
            if (data.response) {
                setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
            } else {
                console.error('AI Response Error:', data.details);
                setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment." }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'bot', content: "Something went wrong. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="assistant-container">
            {!isOpen && (
                <button className="assistant-btn" onClick={() => setIsOpen(true)}>
                    <svg width="40" height="40" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="224" y="352" width="576" height="352" rx="140" fill="white" />
                        <path d="M368 496C368 472 392 448 432 448C472 448 496 472 496 496" stroke="#3B82F6" strokeWidth="40" strokeLinecap="round" />
                        <path d="M528 496C528 472 552 448 592 448C632 448 656 472 656 496" stroke="#3B82F6" strokeWidth="40" strokeLinecap="round" />
                        <path d="M472 592C472 612 492 628 512 628C532 628 552 612 552 592" stroke="#3B82F6" strokeWidth="24" strokeLinecap="round" />
                        <rect x="80" y="384" width="48" height="256" rx="24" fill="white" />
                        <rect x="896" y="384" width="48" height="256" rx="24" fill="white" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="assistant-window">
                    <div className="assistant-header">
                        <div className="header-info">
                            <h3>BlueVitals Concierge</h3>
                            <p>Online • Help Center</p>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.role}`}>
                                <div className="markdown-content">
                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="typing">Syncing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button className="send-btn" onClick={handleSend} disabled={isLoading}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
