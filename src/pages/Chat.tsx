import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Shield, AlertTriangle, X, Phone, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'peer';
  timestamp: Date;
  moderated?: boolean;
  warning?: string;
}

const toxicKeywords = ['hate', 'kill', 'stupid', 'idiot', 'worthless', 'shut up', 'loser'];
const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self-harm'];

const moderateMessage = (text: string): { blocked: boolean; warning?: string } => {
  const lower = text.toLowerCase();
  if (crisisKeywords.some(k => lower.includes(k))) {
    return { blocked: true, warning: 'This message has been flagged for containing crisis content. Please call 988 for immediate support.' };
  }
  if (toxicKeywords.some(k => lower.includes(k))) {
    return { blocked: true, warning: 'Message blocked: Please keep our space supportive and kind.' };
  }
  return { blocked: false };
};

const peerResponses = [
  "I really understand what you're going through. It takes courage to share that.",
  "Thank you for opening up. I've been feeling something very similar lately.",
  "That resonates deeply with me. You're not alone in this.",
  "I hear you. The feelings you're describing are so valid.",
  "I went through something similar. What helped me was taking it one day at a time.",
  "It's okay to feel that way. How can I best support you right now?",
  "I appreciate you sharing that. It helps me feel less alone too.",
];

export const Chat = () => {
  const { currentMatch } = useJournal();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: `Hi! I'm ${currentMatch?.anonymousName || 'your match'}. I read that you're going through some tough emotions. I've been there too. How are you doing right now?`,
      sender: 'peer',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [moderationWarning, setModerationWarning] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || sessionEnded) return;
    const modResult = moderateMessage(input);
    if (modResult.blocked) {
      setModerationWarning(modResult.warning || 'Message blocked by AI moderation.');
      return;
    }
    setModerationWarning('');
    const msg: Message = { id: Date.now().toString(), text: input.trim(), sender: 'me', timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    setInput('');

    // Simulate peer typing + response
    setIsTyping(true);
    setTimeout(() => {
      const response = peerResponses[Math.floor(Math.random() * peerResponses.length)];
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'peer',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1800 + Math.random() * 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!currentMatch) {
    return (
      <AppLayout>
        <div className="p-8 max-w-2xl mx-auto text-center py-24">
          <div className="w-16 h-16 rounded-2xl gradient-lavender flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">No Active Match</h2>
          <p className="text-muted-foreground mb-6">Find a compatible peer first to start a safe chat session.</p>
          <Link to="/match">
            <Button className="gradient-primary text-primary-foreground rounded-xl shadow-soft">Find a Match</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={currentMatch.avatar} alt={currentMatch.anonymousName} className="w-10 h-10 rounded-xl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{currentMatch.anonymousName}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3 text-success" /> {currentMatch.compatibility}% match · {currentMatch.supportMode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
              <Shield className="w-3 h-3" /> AI Moderated
            </div>
            {!sessionEnded && (
              <Button variant="outline" onClick={() => setSessionEnded(true)} className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl text-sm gap-1">
                <X className="w-3.5 h-3.5" /> End Session
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 gradient-calm">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              {msg.sender === 'peer' && (
                <img src={currentMatch.avatar} alt="" className="w-7 h-7 rounded-lg mr-2 flex-shrink-0 mt-auto" />
              )}
              <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'me'
                    ? 'gradient-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card border border-border text-foreground rounded-bl-sm shadow-card'
                }`}>
                  {msg.text}
                </div>
                <span className="text-xs text-muted-foreground px-1">{formatTime(msg.timestamp)}</span>
              </div>
              {msg.sender === 'me' && (
                <div className="w-7 h-7 rounded-lg ml-2 flex-shrink-0 mt-auto gradient-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                  {user?.anonymousName?.charAt(0)}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2 animate-fade-in">
              <img src={currentMatch.avatar} alt="" className="w-7 h-7 rounded-lg" />
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-card">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Moderation warning */}
        {moderationWarning && (
          <div className="mx-6 mb-2 flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{moderationWarning}</p>
              {moderationWarning.includes('988') && (
                <a href="tel:988" className="flex items-center gap-1 text-sm text-crisis font-medium mt-1">
                  <Phone className="w-3.5 h-3.5" /> Call 988 Crisis Lifeline
                </a>
              )}
            </div>
            <button onClick={() => setModerationWarning('')} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Session ended */}
        {sessionEnded && (
          <div className="mx-6 mb-2 p-4 rounded-xl bg-muted/50 border border-border text-center">
            <p className="text-sm text-foreground font-medium">Session ended. Thank you for connecting. 💙</p>
            <p className="text-xs text-muted-foreground mt-1">All messages are cleared when you leave this session.</p>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 bg-card border-t border-border">
          <div className="flex items-end gap-3 max-w-full">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={sessionEnded ? 'Session has ended' : 'Type a message... (Enter to send)'}
                disabled={sessionEnded}
                className="rounded-xl bg-muted border-border pr-4 py-3 h-auto text-sm"
                maxLength={500}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || sessionEnded}
              className="gradient-primary text-primary-foreground rounded-xl h-10 w-10 p-0 flex-shrink-0 shadow-soft hover:shadow-glow transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3 text-success" /> Messages are AI-moderated for safety. No harmful content is permitted.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
