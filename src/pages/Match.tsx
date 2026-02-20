import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useJournal, MatchedPeer } from '@/context/JournalContext';
import { Button } from '@/components/ui/button';
import { Users, Loader2, MessageCircle, Heart, Star, Shield, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const mockPeers: MatchedPeer[] = [
  { id: '1', anonymousName: 'TranquilRiver42', avatar: 'https://ui-avatars.com/api/?name=TR&background=4f6ef7&color=fff&rounded=true&size=128', compatibility: 91, sharedEmotions: ['anxiety', 'stress'], supportMode: 'Vent Mode', bio: 'Going through a tough career transition. I know what burnout feels like and I\'m here to listen without judgment.' },
  { id: '2', anonymousName: 'StillWater88', avatar: 'https://ui-avatars.com/api/?name=SW&background=7c3aed&color=fff&rounded=true&size=128', compatibility: 84, sharedEmotions: ['loneliness', 'grief'], supportMode: 'Advice Mode', bio: 'Navigating grief and slowly finding meaning. I believe in sharing wisdom and coping strategies that actually work.' },
  { id: '3', anonymousName: 'GentleBreeze17', avatar: 'https://ui-avatars.com/api/?name=GB&background=2563eb&color=fff&rounded=true&size=128', compatibility: 78, sharedEmotions: ['burnout', 'stress'], supportMode: 'Accountability Mode', bio: 'Recovering from burnout, one day at a time. Accountability helps me immensely — let\'s keep each other on track.' },
  { id: '4', anonymousName: 'QuietMeadow55', avatar: 'https://ui-avatars.com/api/?name=QM&background=059669&color=fff&rounded=true&size=128', compatibility: 73, sharedEmotions: ['anxiety'], supportMode: 'Vent Mode', bio: 'Dealing with chronic anxiety and learning to sit with discomfort. Your feelings are always valid here.' },
];

const emotionColors: Record<string, string> = {
  anxiety: 'emotion-anxiety',
  stress: 'emotion-stress',
  grief: 'emotion-grief',
  loneliness: 'emotion-loneliness',
  burnout: 'emotion-burnout',
};

const getCompatibilityColor = (score: number) => {
  if (score >= 85) return 'text-success';
  if (score >= 70) return 'text-primary';
  return 'text-warning';
};

const getCompatibilityLabel = (score: number) => {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Strong Match';
  return 'Good Match';
};

export const Match = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vent' | 'advice' | 'accountability'>('all');
  const { setCurrentMatch } = useJournal();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsSearching(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsSearching(false);
    setHasSearched(true);
  };

  const handleConnect = (peer: MatchedPeer) => {
    setCurrentMatch(peer);
    navigate('/chat');
  };

  const filteredPeers = mockPeers.filter(p => {
    if (selectedFilter === 'all') return true;
    return p.supportMode.toLowerCase().includes(selectedFilter);
  });

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-foreground">Find Your Match</h1>
          <p className="text-muted-foreground mt-1">AI-powered peer matching based on your emotional profile.</p>
        </div>

        {/* How it works */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="text-lg font-serif font-semibold text-foreground mb-4">How Matching Works</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Emotion Vectors', desc: 'Your journal creates an emotional embedding vector' },
              { step: '2', title: 'Cosine Similarity', desc: 'We compare your vector to other anonymous users' },
              { step: '3', title: 'Safe Connection', desc: 'Top matches filtered by support mode and safety' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center p-4 rounded-xl bg-muted/40">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold mx-auto mb-2">{step}</div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground mr-1">Filter by mode:</span>
          {[
            { value: 'all', label: 'All Modes' },
            { value: 'vent', label: '💬 Vent' },
            { value: 'advice', label: '💡 Advice' },
            { value: 'accountability', label: '🤝 Accountability' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedFilter(value as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === value
                  ? 'gradient-primary text-primary-foreground shadow-soft'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search button */}
        {!hasSearched && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border shadow-card mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-lavender flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">Ready to Find Your Match?</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Based on your journal entries, our AI will analyze your emotional profile and find compatible peers.
            </p>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="gradient-primary text-primary-foreground rounded-xl shadow-soft hover:shadow-glow transition-all gap-2 px-8"
              size="lg"
            >
              {isSearching ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your profile...</>
              ) : (
                <><Heart className="w-5 h-5" /> Find My Matches</>
              )}
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isSearching && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border shadow-card mb-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium">Comparing emotional vectors...</p>
            <p className="text-sm text-muted-foreground mt-1">Finding your most compatible peers</p>
            <div className="flex justify-center gap-1 mt-4">
              {['Analyzing sentiment', 'Computing similarity', 'Filtering by mode', 'Ranking matches'].map((s, i) => (
                <div key={s} className="h-1.5 rounded-full bg-primary/30 animate-pulse" style={{ width: 60 + i * 10, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Peer cards */}
        {hasSearched && !isSearching && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{filteredPeers.length} compatible peers found</p>
              <button onClick={handleSearch} className="flex items-center gap-1 text-sm text-primary hover:underline">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            {filteredPeers.map((peer, i) => (
              <div key={peer.id} className={`bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elevated transition-all duration-300 ${i === 0 ? 'ring-2 ring-primary/30' : ''}`}>
                {i === 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-xs font-semibold text-warning uppercase tracking-wide">Best Match</span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <img src={peer.avatar} alt={peer.anonymousName} className="w-14 h-14 rounded-2xl ring-2 ring-border" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{peer.anonymousName}</h3>
                        <p className="text-xs text-muted-foreground">{peer.supportMode}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-serif font-bold ${getCompatibilityColor(peer.compatibility)}`}>
                          {peer.compatibility}%
                        </p>
                        <p className={`text-xs ${getCompatibilityColor(peer.compatibility)}`}>{getCompatibilityLabel(peer.compatibility)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{peer.bio}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Shared:</span>
                        {peer.sharedEmotions.map(em => (
                          <span key={em} className={`text-xs px-2 py-0.5 rounded-full ${emotionColors[em] || 'bg-muted'}`}>{em}</span>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleConnect(peer)}
                        className="gradient-primary text-primary-foreground rounded-xl gap-2 shadow-soft hover:shadow-glow transition-all text-sm"
                      >
                        <MessageCircle className="w-4 h-4" /> Connect
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Compatibility bar */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-3 h-3 text-success flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${peer.compatibility}%`,
                          background: 'var(--gradient-primary)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Cosine similarity: {(peer.compatibility / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
