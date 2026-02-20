import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useJournal } from '@/context/JournalContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen, Loader2, AlertTriangle, CheckCircle, Sparkles, Calendar,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const supportModes = [
  { value: 'vent' as const, label: 'Vent Mode', emoji: '💬', desc: 'I just need to be heard' },
  { value: 'advice' as const, label: 'Advice Mode', emoji: '💡', desc: 'I\'m looking for guidance' },
  { value: 'accountability' as const, label: 'Accountability Mode', emoji: '🤝', desc: 'I want mutual support' },
];

const emotionColors: Record<string, string> = {
  anxiety: 'emotion-anxiety',
  stress: 'emotion-stress',
  grief: 'emotion-grief',
  loneliness: 'emotion-loneliness',
  burnout: 'emotion-burnout',
  positive: 'emotion-positive',
};

const prompts = [
  'Today I felt...',
  'Something that\'s been on my mind is...',
  'I\'m struggling with...',
  'One thing that helped me today was...',
  'I\'m grateful for... but I\'m also worried about...',
];

export const Journal = () => {
  const [content, setContent] = useState('');
  const [supportMode, setSupportMode] = useState<'vent' | 'advice' | 'accountability'>('vent');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const { entries, addEntry, isAnalyzing } = useJournal();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isAnalyzing) return;
    const entry = await addEntry(content, supportMode);
    setAnalysisResult(entry);
    setContent('');
  };

  const handleFindMatch = () => {
    navigate('/match');
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-foreground">Your Journal</h1>
          <p className="text-muted-foreground mt-1">Express yourself freely. AI will analyze and find your perfect match.</p>
        </div>

        {/* Write entry */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-semibold text-foreground">New Entry</h2>
          </div>

          {/* Prompt suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {prompts.map(p => (
              <button
                key={p}
                onClick={() => setContent(content ? content + ' ' + p : p)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all text-muted-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write freely about how you're feeling today... There's no right or wrong way to express yourself here. This is your safe space."
              className="min-h-[180px] rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground resize-none leading-relaxed text-base p-4 focus:ring-2 focus:ring-primary/30"
              disabled={isAnalyzing}
            />

            {/* Support mode */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">What kind of support are you looking for?</p>
              <div className="grid grid-cols-3 gap-3">
                {supportModes.map(({ value, label, emoji, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSupportMode(value)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      supportMode === value
                        ? 'border-primary bg-primary/10 shadow-soft'
                        : 'border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <p className={`text-sm font-semibold ${supportMode === value ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{content.length}/2000 characters</p>
              <Button
                type="submit"
                disabled={!content.trim() || isAnalyzing || content.length > 2000}
                className="gradient-primary text-primary-foreground rounded-xl shadow-soft hover:shadow-glow transition-all gap-2 px-6"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Submit & Analyze</>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* AI Analysis result */}
        {analysisResult && (
          <div className={`rounded-2xl border p-6 mb-8 animate-fade-up ${analysisResult.riskFlag ? 'bg-crisis-light border-crisis/30' : 'bg-success/5 border-success/30'}`}>
            {analysisResult.riskFlag ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-crisis" />
                  <h3 className="text-lg font-serif font-semibold text-crisis">We noticed some concerning feelings</h3>
                </div>
                <p className="text-sm text-foreground/80 mb-4">
                  Your entry suggests you may be going through a very difficult time. Please know you're not alone and help is available.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a href="tel:988" className="block p-4 rounded-xl bg-crisis/10 border border-crisis/20 text-center hover:bg-crisis/20 transition-colors">
                    <p className="text-lg font-bold text-crisis">988</p>
                    <p className="text-xs text-muted-foreground">Crisis Lifeline (Call/Text)</p>
                  </a>
                  <a href="sms:741741" className="block p-4 rounded-xl bg-crisis/10 border border-crisis/20 text-center hover:bg-crisis/20 transition-colors">
                    <p className="text-lg font-bold text-crisis">741741</p>
                    <p className="text-xs text-muted-foreground">Crisis Text Line</p>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <h3 className="text-lg font-serif font-semibold text-foreground">AI Analysis Complete</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Detected Emotions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.emotions.map((em: string) => (
                        <span key={em} className={`text-sm px-3 py-1 rounded-full font-medium ${emotionColors[em] || 'bg-muted text-foreground'}`}>{em}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Sentiment</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${analysisResult.sentimentScore * 100}%`,
                            backgroundColor: analysisResult.sentiment === 'positive' ? 'hsl(152 60% 45%)' : analysisResult.sentiment === 'negative' ? 'hsl(0 72% 62%)' : 'hsl(225 60% 58%)',
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium capitalize text-foreground">{analysisResult.sentiment}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-foreground flex-1">Embedding vector generated. Ready to find your match!</p>
                  <Button onClick={handleFindMatch} className="gradient-primary text-primary-foreground rounded-xl gap-2 shadow-soft">
                    Find My Match →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Journal history */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-serif font-semibold text-foreground">Journal History</h2>
            <span className="ml-auto text-sm text-muted-foreground">{entries.length} entries</span>
          </div>

          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="border border-border rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.riskFlag ? 'bg-crisis' : entry.sentiment === 'negative' ? 'bg-warning' : 'bg-success'}`} />
                  <p className="flex-1 text-sm text-foreground line-clamp-1">{entry.content}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {entry.emotions.slice(0, 2).map(em => (
                      <span key={em} className={`text-xs px-2 py-0.5 rounded-full ${emotionColors[em] || 'bg-muted'}`}>{em}</span>
                    ))}
                    <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()}</span>
                    {expandedEntry === entry.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>
                {expandedEntry === entry.id && (
                  <div className="px-4 pb-4 border-t border-border bg-muted/20">
                    <p className="text-sm text-foreground leading-relaxed pt-3">{entry.content}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">Support Mode: <strong className="text-foreground capitalize">{entry.supportMode}</strong></span>
                      <span className="text-xs text-muted-foreground">Risk: <strong className={entry.riskFlag ? 'text-crisis' : 'text-success'}>{entry.riskLevel}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
