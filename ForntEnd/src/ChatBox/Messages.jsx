import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Messages = () => {
    const [messageA, setMessageA] = useState('');
    const [messageB, setMessageB] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Load messages from local storage when the component mounts
        const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        setMessages(storedMessages);

        // Register User A
        socket.emit('register', 'User A');

        socket.on('message', (msg) => {
            // Check if the message is already in the messages array
            setMessages((prevMessages) => {
                if (!prevMessages.some(m => m.text === msg.text && m.user === msg.user)) {
                    const updatedMessages = [...prevMessages, msg];
                    localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
                    return updatedMessages;
                }
                return prevMessages; // Return previous messages if it's a duplicate
            });
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessageA = (e) => {
        e.preventDefault();
        if (messageA.trim() !== '') {
            const msg = {
                user: 'User A',
                text: messageA,
            };
            socket.emit('message', msg);
            // Update local state and local storage
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, msg];
                localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
                return updatedMessages;
            });
            setMessageA('');
        }
    };

    const sendMessageB = (e) => {
        e.preventDefault();
        if (messageB.trim() !== '') {
            const msg = {
                user: 'User B',
                text: messageB,
            };
            socket.emit('message', msg);
            // Update local state and local storage
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, msg];
                localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save to localStorage
                return updatedMessages;
            });
            setMessageB('');
        }
    };

    const clearMessages = () => {
        setMessages([]); // Clear messages state
        localStorage.removeItem('messages'); // Clear local storage
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Chat</h2>
            <div className="h-72 overflow-y-auto border border-gray-300 rounded-lg p-2 mb-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.user === 'User A' ? 'text-right' : 'text-left'}`}>
                        <span className={`font-bold ${msg.user === 'User A' ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {msg.user}:
                        </span>
                        <span className="text-gray-800"> {msg.text}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessageA} className="flex mb-4">
                <input
                    type="text"
                    value={messageA}
                    onChange={(e) => setMessageA(e.target.value)}
                    placeholder="User A: Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition duration-200">
                    Send A
                </button>
            </form>

            <form onSubmit={sendMessageB} className="flex mb-4">
                <input
                    type="text"
                    value={messageB}
                    onChange={(e) => setMessageB(e.target.value)}
                    placeholder="User B: Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit" className="bg-yellow-500 text-white p-2 rounded-r-lg hover:bg-yellow-600 transition duration-200">
                    Send B
                </button>
            </form>

            {/* Clear Messages Button */}
            <button
                onClick={clearMessages}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200 mt-4 w-full"
            >
                Clear All Messages
            </button>
        </div>
    );
};

export default Messages;
