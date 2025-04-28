
// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import { Bot, SendHorizontal, Trash, XCircle } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const YOUR_API_KEY = 'AIzaSyBUQqVji9-y_QLJypyMvoI1RrejENgZXFI'; // Replace with your actual API key
// const genAI = new GoogleGenerativeAI(YOUR_API_KEY);

// interface AIChatBoxProps {
//   open: boolean;
//   onClose: () => void;
// }

// const AIChatBox: React.FC<AIChatBoxProps> = ({ open, onClose }) => {
//   const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (open) {
//       inputRef.current?.focus();
//     }
//   }, [open]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInput(e.target.value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage: { role: 'user'; content: string } = { role: 'user', content: input };
//     setMessages([...messages, userMessage]);
//     setInput('');
//     setIsLoading(true);
//     setError(null);

//     try {
//       const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//       const result = await model.generateContent(input);
//       const response = await result.response.text();
//       const aiMessage: { role: 'assistant'; content: string } = { role: 'assistant', content: response };
//       setMessages([...messages, userMessage, aiMessage]);
//     } catch (err) {
//       setError('Something went wrong. Please try again!');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearMessages = () => {
//     setMessages([]);
//   };

//   return (
//     <div
//       className={`fixed inset-0 flex items-center justify-center z-50 ${open ? 'block' : 'hidden'}`}
//     >
//       <div className="flex flex-col h-[300px] w-full max-w-sm p-4 border bg-background shadow-xl rounded-lg overflow-hidden">
//         <div className="flex items-center justify-between bg-blue-500 p-4 rounded">
//           <h2 className="text-white font-bold">Faizcasm AI</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
//             <XCircle size={24} />
//           </button>
//         </div>
//         <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`mb-3 flex items-center ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
//             >
//               {message.role === 'assistant' && <Bot className="mr-2" />}
//               <div
//                 className={`rounded-md border px-3 py-2 ${message.role === 'assistant' ? 'bg-background' : 'bg-foreground text-background'}`}
//               >
//                 <ReactMarkdown>{message.content}</ReactMarkdown>
//               </div>
//             </div>
//           ))}
//           {isLoading && (
//             <div className="mb-3 flex items-center">
//               <Bot className="mr-2" />
//               <div className="rounded-md border px-3 py-2 bg-background">🤖 is Thinking...</div>
//             </div>
//           )}
//           {error && (
//             <div className="mb-3 flex items-center">
//               <Bot className="mr-2" />
//               <div className="rounded-md border px-3 py-2 bg-background">{error}</div>
//             </div>
//           )}
//         </div>
//         <form onSubmit={handleSubmit} className="m-3 flex gap-1">
//           <button
//             type="button"
//             className="flex w-10 flex-none items-center justify-center hover:text-red-500 transition-colors"
//             title="Clear chat"
//             onClick={clearMessages}
//           >
//             <Trash size={24} />
//           </button>
//           <input
//             value={input}
//             onChange={handleInputChange}
//             placeholder="Say something..."
//             className="flex-grow rounded-full border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             ref={inputRef}
//           />
//           <button
//             type="submit"
//             className="flex w-10 flex-none items-center justify-center disabled:opacity-50 hover:text-blue-400 transition-colors"
//             disabled={input.length === 0}
//             title="Submit message"
//           >
//             <SendHorizontal size={24} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AIChatBox;


"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Bot, SendHorizontal, Trash, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const AIChatBox: React.FC<AIChatBoxProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://chatbot-s52q.onrender.com/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text();

      const aiMessage: Message = { role: 'assistant', content: data };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="flex flex-col h-[300px] w-full max-w-sm p-4 border bg-background shadow-xl rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-blue-500 p-4 rounded">
          <h2 className="text-white font-bold">Faizcasm AI</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 flex items-center ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              {message.role === 'assistant' && <Bot className="mr-2" />}
              <div
                className={`rounded-md border px-3 py-2 ${message.role === 'assistant' ? 'bg-background' : 'bg-foreground text-background'}`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-3 flex items-center">
              <Bot className="mr-2" />
              <div className="rounded-md border px-3 py-2 bg-background">🤖 is Thinking...</div>
            </div>
          )}
          {error && (
            <div className="mb-3 flex items-center">
              <Bot className="mr-2" />
              <div className="rounded-md border px-3 py-2 bg-background">{error}</div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <button
            type="button"
            className="flex w-10 flex-none items-center justify-center hover:text-red-500 transition-colors"
            title="Clear chat"
            onClick={clearMessages}
          >
            <Trash size={24} />
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
             className="flex-grow rounded-full border border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
{/*             className="flex-grow rounded-full border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" */}
            ref={inputRef}
          />
          <button
            type="submit"
            className="flex w-10 flex-none items-center justify-center disabled:opacity-50 hover:text-blue-400 transition-colors"
            disabled={input.length === 0}
            title="Submit message"
          >
            <SendHorizontal size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBox;


