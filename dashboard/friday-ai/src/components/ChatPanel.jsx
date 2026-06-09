import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Clock, User, Cpu } from 'lucide-react';

const DEMO_RESPONSES = [
  "All systems are nominal, boss. Neural pathways are operating at 97.3% efficiency. Shall I run a full diagnostic sweep or proceed with your query?",
  "Analysis complete. Cross-referencing 847 data points across Stark Industries' secure network. Confidence interval: 99.2%. Standing by for further instructions.",
  "I've been monitoring global communications and financial markets. Nothing that warrants immediate attention, though the Tokyo exchange shows some interesting volatility patterns you might find worth reviewing.",
  "Threat assessment completed. No active incursions detected. Perimeter integrity holding at 100%. I'd say we're having a quiet morning — relatively speaking.",
  "Interesting query. Running probabilistic models now... Based on current trajectory, I'd estimate a 73.8% probability of success. Want me to optimize the remaining variables?",
];

function ChatBubble({ msg, index }) {
  const [displayed, setDisplayed] = useState(msg.role === 'user' ? msg.text : '');
  const [done, setDone] = useState(msg.role === 'user');
  const idxRef = useRef(0);

  useEffect(() => {
    if (msg.role !== 'assistant') return;
    setDisplayed('');
    idxRef.current = 0;
    const delay = 200;
    const speed = 18;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        idxRef.current++;
        setDisplayed(msg.text.slice(0, idxRef.current));
        if (idxRef.current >= msg.text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [msg.text, msg.role]);

  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
        style={{
          background: isUser ? 'rgba(0,229,255,0.15)' : 'rgba(0,100,180,0.2)',
          border: `1px solid ${isUser ? 'rgba(0,229,255,0.4)' : 'rgba(0,150,220,0.3)'}`,
        }}
      >
        {isUser
          ? <User size={12} style={{ color: '#00e5ff' }} />
          : <Cpu size={12} style={{ color: '#60c8e8' }} />
        }
      </div>

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
          <span style={{ color: 'rgba(0,180,220,0.5)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
            {isUser ? 'USER' : 'FRIDAY'}
          </span>
          <span style={{ color: 'rgba(0,140,180,0.35)', fontSize: 9 }} className="font-mono">
            {msg.time}
          </span>
        </div>

        <div
          className="relative rounded-lg px-3.5 py-2.5"
          style={{
            background: isUser
              ? 'rgba(0, 229, 255, 0.08)'
              : 'rgba(0, 20, 60, 0.7)',
            border: `1px solid ${isUser ? 'rgba(0,229,255,0.2)' : 'rgba(0,180,220,0.12)'}`,
            boxShadow: isUser ? 'none' : 'inset 0 0 20px rgba(0,100,200,0.05)',
          }}
        >
          <p style={{ color: isUser ? 'rgba(200,240,255,0.9)' : 'rgba(180,225,245,0.85)', fontSize: 12.5, lineHeight: 1.6 }}
            className="font-mono">
            {displayed}
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ color: '#00e5ff' }}
              >▋</motion.span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatPanel({ onAsk, loading }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Good morning. All systems online. FRIDAY v4.2.1 initialized and ready. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = {
      role: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(m => [...m, userMsg]);
    setInput('');

    try {
      const response = await onAsk(input.trim());
      setMessages(m => [...m, {
        role: 'assistant',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      const demoReply = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      setMessages(m => [...m, {
        role: 'assistant',
        text: `[DEMO MODE — Backend offline]\n\n${demoReply}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3"
        style={{ minHeight: 0 }}
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} index={i} />
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,100,180,0.2)', border: '1px solid rgba(0,150,220,0.3)' }}
            >
              <Cpu size={12} style={{ color: '#60c8e8' }} />
            </div>
            <div className="rounded-lg px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(0,20,60,0.7)', border: '1px solid rgba(0,180,220,0.12)' }}
            >
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00e5ff' }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative">
        <div className="flex items-center gap-1.5 mb-1">
          <Terminal size={10} style={{ color: 'rgba(0,229,255,0.4)' }} />
          <span style={{ color: 'rgba(0,180,220,0.4)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
            Command Input
          </span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs"
              style={{ color: 'rgba(0,229,255,0.4)' }}>
              &gt;_
            </span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Enter command or query..."
              className="input-glow w-full pl-8 pr-3 py-2.5 rounded-lg font-mono text-xs outline-none transition-all"
              style={{
                background: 'rgba(0,10,30,0.8)',
                border: '1px solid rgba(0,229,255,0.2)',
                color: 'rgba(200,240,255,0.9)',
                caretColor: '#00e5ff',
              }}
            />
          </div>
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="stark-btn px-3 rounded-lg flex items-center justify-center"
            style={{
              background: input.trim() ? 'rgba(0,229,255,0.15)' : 'rgba(0,229,255,0.04)',
              border: `1px solid ${input.trim() ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.1)'}`,
              color: input.trim() ? '#00e5ff' : 'rgba(0,180,220,0.3)',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
