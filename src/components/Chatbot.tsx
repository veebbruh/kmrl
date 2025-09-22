import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function Chatbot() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([
    { role: 'bot', text: language === 'ml' ? 'ഹലോ! എങ്ങനെ സഹായിക്കാം?' : 'Hello! How can I help you?' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    // Simple echo bot placeholder
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: language === 'ml' ? `നിങ്ങൾ പറഞ്ഞു: ${userText}` : `You said: ${userText}` },
      ]);
    }, 400);
  };

  return (
    <div className="h-[70vh] max-h-[70vh] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chatbot</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className={`${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'} max-w-[80%] px-3 py-2 rounded-lg`}>
            {m.text}
          </motion.div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder={language === 'ml' ? 'സന്ദേശം ടൈപ്പ് ചെയ്യുക...' : 'Type a message...'}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none border border-gray-200 dark:border-gray-600"
        />
        <button onClick={send} className="px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center space-x-1">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}


