import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your expert jewelry assistant at Luxury Jewelers. I can help you with product information, sizing, care instructions, gift recommendations, and custom design inquiries. How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('/api/chatbot/health');
      setApiStatus(response.data.hasGeminiKey ? 'online' : 'fallback');
    } catch (error) {
      setApiStatus('fallback');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    // Add user message
    const userMessageObj = { 
      text: userMessage, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessageObj]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chatbot', { 
        message: userMessage
      });
      
      const botMessage = { 
        text: res.data.reply, 
        sender: 'bot',
        timestamp: new Date(),
        source: res.data.source
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      
      const errorMessage = "I'm having trouble connecting right now. Please contact our store directly at (555) 123-LUXURY for immediate assistance.";
      
      const errorMessageObj = { 
        text: errorMessage, 
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([
      { 
        text: "Hello! I'm your expert jewelry assistant. How can I help you today?", 
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  // Enhanced suggested questions with icons
  const suggestedQuestions = [
    { 
      question: "What's the difference between 14k and 18k gold?", 
      icon: "💎"
    },
    { 
      question: "How do I measure my ring size at home?", 
      icon: "📏"
    },
    { 
      question: "What jewelry makes the best anniversary gift?", 
      icon: "🎁"
    },
    { 
      question: "How should I clean my diamond ring?", 
      icon: "✨"
    },
    { 
      question: "Do you offer custom jewelry design?", 
      icon: "🎨"
    }
  ];

  const handleSuggestionClick = (question) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to format message text with better styling
  const formatMessageText = (text) => {
    // Convert markdown-style **bold** to spans with font-semibold
    const formattedText = text.split('**').map((part, index) => {
      return index % 2 === 1 ? 
        `<span class="font-semibold text-inherit">${part}</span>` : 
        part;
    }).join('');

    // Convert line breaks to <br /> and lists to proper formatting
    const withLineBreaks = formattedText.split('\n').map((line, index, array) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return `<div class="flex items-start space-x-2 py-0.5">
                  <span class="text-lg mt-0.5 flex-shrink-0">•</span>
                  <span>${line.replace(/^[•\-]\s*/, '')}</span>
                </div>`;
      }
      return line + (index < array.length - 1 ? '<br />' : '');
    }).join('');

    return { __html: withLineBreaks };
  };

  return (
    <>
      {/* Mobile Toggle Button - Always bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="text-white text-xl font-bold">✕</span>
        ) : (
          <div className="relative">
            <span className="text-white text-2xl group-hover:scale-110 transition-transform">💎</span>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              apiStatus === 'online' ? 'bg-green-400' : 
              apiStatus === 'fallback' ? 'bg-yellow-400' : 'bg-gray-400'
            } animate-pulse`}></div>
          </div>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed z-40 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 backdrop-blur-sm bg-white/95
          /* Mobile: Take most of screen */
          bottom-20 right-4 left-4 h-[75vh] max-h-[700px]
          /* Large screens: Bottom right corner with fixed size */
          lg:bottom-20 lg:right-6 lg:left-auto lg:w-96 lg:h-[450px]">
          
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white p-5 rounded-t-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Jewelry Expert</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      apiStatus === 'online' ? 'bg-green-400' : 
                      apiStatus === 'fallback' ? 'bg-yellow-400' : 'bg-gray-400'
                    } animate-pulse`}></div>
                    <p className="text-sm opacity-90 font-medium">
                      {apiStatus === 'online' ? 'AI Expert Online' : 
                       apiStatus === 'fallback' ? 'Basic Mode' : 'Checking...'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={clearConversation}
                  className="text-white hover:text-gray-200 transition duration-200 p-2 rounded-xl hover:bg-white/10"
                  title="Clear conversation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                {/* Bot Avatar */}
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 mr-3 self-end mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm">💎</span>
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-3xl px-5 py-4 relative transition-all duration-200 ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg rounded-br-md' 
                    : msg.isError
                    ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-800 border border-red-200 shadow-sm rounded-bl-md'
                    : 'bg-white text-gray-800 shadow-lg border border-gray-100/80 rounded-bl-md'
                }`}>
                  
                  {/* Message Text with Enhanced Styling */}
                  <div 
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user' ? 'text-white' : 'text-gray-700'
                    }`}
                    dangerouslySetInnerHTML={formatMessageText(msg.text)}
                  />
                  
                  {/* Message Time */}
                  <div className={`flex items-center justify-between mt-3 pt-2 ${
                    msg.sender === 'user' ? 'border-blue-500/30' : 'border-gray-200'
                  } border-t`}>
                    <div className={`text-xs ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                    {msg.source && msg.source.includes('fallback') && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-yellow-600 font-medium">Basic Mode</span>
                      </div>
                    )}
                  </div>

                  {/* Decorative Corner */}
                  {msg.sender === 'user' && (
                    <div className="absolute -right-1 bottom-0 w-4 h-4 bg-blue-600 transform rotate-45"></div>
                  )}
                  {msg.sender === 'bot' && !msg.isError && (
                    <div className="absolute -left-1 bottom-0 w-4 h-4 bg-white border-l border-t border-gray-100/80 transform rotate-45"></div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 ml-3 self-end mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm">👤</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Enhanced Loading Animation */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-3 self-end mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm">💎</span>
                  </div>
                </div>
                <div className="bg-white text-gray-800 rounded-3xl rounded-bl-md shadow-lg border border-gray-100/80 px-5 py-4 max-w-[85%]">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced Suggested Questions */}
            {messages.length <= 2 && (
              <div className="space-y-3 mt-6">
                <p className="text-xs text-gray-500 text-center font-medium">Quick questions you might have:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item.question)}
                      className="text-left text-sm bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl px-4 py-3 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-blue-600 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="flex-1">{item.question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Enhanced Input Area */}
          <div className="p-5 border-t border-gray-200/80 bg-white/95 backdrop-blur-sm rounded-b-2xl">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm pr-12"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about jewelry, sizing, care, or recommendations..."
                  disabled={loading}
                />
                {input.length > 0 && (
                  <button
                    onClick={() => setInput('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl w-14 h-14 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg"
                aria-label="Send message"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3 font-medium">
              {apiStatus === 'online' ? '💎 AI Jewelry Expert • 24/7 Assistance' : 
               apiStatus === 'fallback' ? '💎 Basic Assistance • Contact store for details' : 
               '💎 Connecting...'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;









// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { 
//       text: "Hello! I'm your expert jewelry assistant. I can help you with product recommendations, sizing, care instructions, and any jewelry-related questions. How can I assist you today?", 
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Focus input when chatbot opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSend = async () => {
//     const userMessage = input.trim();
//     if (!userMessage || loading) return;

//     // Add user message
//     const userMessageObj = { 
//       text: userMessage, 
//       sender: 'user',
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, userMessageObj]);
//     setInput('');
//     setLoading(true);
//     setError('');

//     try {
//       const res = await axios.post('/api/chatbot', { 
//         message: userMessage,
//         conversationId: conversationId
//       });
      
//       const botMessage = { 
//         text: res.data.reply, 
//         sender: 'bot',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (err) {
//       console.error('Chatbot error:', err);
      
//       let errorMessage = "I'm having trouble responding right now. Please try again in a moment.";
      
//       if (err.response?.status === 503) {
//         errorMessage = "Our AI service is temporarily unavailable. Please try again later.";
//       } else if (err.response?.data?.error) {
//         errorMessage = err.response.data.error;
//       }
      
//       setError(errorMessage);
//       const errorMessageObj = { 
//         text: errorMessage, 
//         sender: 'bot',
//         timestamp: new Date(),
//         isError: true
//       };
//       setMessages(prev => [...prev, errorMessageObj]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const clearConversation = () => {
//     setMessages([
//       { 
//         text: "Hello! I'm your expert jewelry assistant. How can I help you today?", 
//         sender: 'bot',
//         timestamp: new Date()
//       }
//     ]);
//     setError('');
//   };

//   // Suggested questions for jewelry store
//   const suggestedQuestions = [
//     "What's the difference between 14k and 18k gold?",
//     "How do I measure my ring size?",
//     "What jewelry is best for a wedding gift?",
//     "How should I care for my diamond ring?",
//     "Do you offer custom jewelry design?"
//   ];

//   const handleSuggestionClick = (question) => {
//     setInput(question);
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 lg:hidden"
//         aria-label={isOpen ? "Close chat" : "Open chat"}
//       >
//         {isOpen ? (
//           <span className="text-white text-xl font-bold">✕</span>
//         ) : (
//           <div className="relative">
//             <span className="text-white text-2xl">💎</span>
//             <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//           </div>
//         )}
//       </button>

//       {/* Desktop Toggle Button - Positioned below navbar */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed top-24 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 hidden lg:flex"
//         aria-label={isOpen ? "Close chat" : "Open chat"}
//       >
//         {isOpen ? (
//           <span className="font-semibold">Close Chat</span>
//         ) : (
//           <div className="flex items-center space-x-2">
//             <span className="text-xl">💎</span>
//             <span className="font-semibold">Chat with Expert</span>
//           </div>
//         )}
//       </button>

//       {/* Chatbot Window */}
//       {isOpen && (
//         <div className="fixed z-40 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 
//           /* Mobile Styles */
//           bottom-20 right-4 left-4 h-[70vh] max-h-[600px]
//           /* Desktop Styles */
//           lg:top-40 lg:right-6 lg:left-auto lg:w-96 lg:h-[65vh] lg:max-h-[700px]">
          
//           {/* Header */}
//           <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//                   <span className="text-xl">💎</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg">Jewelry Expert</h3>
//                   <p className="text-sm opacity-90 flex items-center">
//                     <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
//                     Online • Ready to help
//                   </p>
//                 </div>
//               </div>
//               <button 
//                 onClick={clearConversation}
//                 className="text-white hover:text-gray-200 transition duration-200 p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
//                 title="Clear conversation"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
          
//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {messages.map((msg, index) => (
//               <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
//                   msg.sender === 'user' 
//                     ? 'bg-blue-600 text-white rounded-br-none' 
//                     : msg.isError
//                     ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-none'
//                     : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
//                 }`}>
//                   <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
//                   <div className={`text-xs mt-1 ${
//                     msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
//                   }`}>
//                     {formatTime(msg.timestamp)}
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm max-w-[85%]">
//                   <div className="flex space-x-2 items-center">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                     </div>
//                     <span className="text-sm text-gray-600">Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Suggested Questions */}
//             {messages.length <= 2 && (
//               <div className="space-y-2 mt-4">
//                 <p className="text-xs text-gray-500 text-center">Try asking:</p>
//                 <div className="grid grid-cols-1 gap-2">
//                   {suggestedQuestions.map((question, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleSuggestionClick(question)}
//                       className="text-left text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition duration-200 text-gray-700 hover:text-blue-600 hover:border-blue-300"
//                     >
//                       {question}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>
          
//           {/* Input Area */}
//           <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
//             {error && (
//               <div className="text-xs text-red-600 mb-2 text-center">
//                 {error}
//               </div>
//             )}
//             <div className="flex space-x-2">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Ask about jewelry, sizing, care, or recommendations..."
//                 disabled={loading}
//               />
//               <button 
//                 onClick={handleSend}
//                 disabled={loading || !input.trim()}
//                 className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0"
//                 aria-label="Send message"
//               >
//                 {loading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 text-center mt-2">
//               Expert jewelry advice • 24/7 available
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Chatbot;
