import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
  emotions: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  embedding?: number[];
  riskLevel: 'low' | 'medium' | 'high';
  riskFlag: boolean;
  supportMode?: 'vent' | 'advice' | 'accountability';
}

export interface MatchedPeer {
  id: string;
  anonymousName: string;
  avatar: string;
  compatibility: number;
  sharedEmotions: string[];
  supportMode: string;
  bio: string;
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (content: string, supportMode: 'vent' | 'advice' | 'accountability') => Promise<JournalEntry>;
  isAnalyzing: boolean;
  currentMatch: MatchedPeer | null;
  setCurrentMatch: (m: MatchedPeer | null) => void;
  findMatch: (entry: JournalEntry) => Promise<MatchedPeer | null>;
  isMatching: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const mockEmotionSets = [
  ['anxiety', 'stress'],
  ['loneliness', 'grief'],
  ['burnout', 'stress'],
  ['anxiety', 'loneliness'],
  ['grief', 'anxiety'],
  ['stress', 'burnout'],
];

const mockPeers: MatchedPeer[] = [
  { id: '1', anonymousName: 'TranquilRiver42', avatar: 'https://ui-avatars.com/api/?name=TR&background=5b8def&color=fff&rounded=true', compatibility: 91, sharedEmotions: ['anxiety', 'stress'], supportMode: 'Vent Mode', bio: 'Going through a tough transition. Here to listen without judgment.' },
  { id: '2', anonymousName: 'StillWater88', avatar: 'https://ui-avatars.com/api/?name=SW&background=7c3aed&color=fff&rounded=true', compatibility: 84, sharedEmotions: ['loneliness', 'grief'], supportMode: 'Advice Mode', bio: 'Navigating grief and finding meaning. I believe in sharing wisdom.' },
  { id: '3', anonymousName: 'GentleBreeze17', avatar: 'https://ui-avatars.com/api/?name=GB&background=2563eb&color=fff&rounded=true', compatibility: 78, sharedEmotions: ['burnout', 'stress'], supportMode: 'Accountability Mode', bio: 'Recovering from burnout slowly. Accountability keeps me going.' },
  { id: '4', anonymousName: 'QuietMeadow55', avatar: 'https://ui-avatars.com/api/?name=QM&background=059669&color=fff&rounded=true', compatibility: 73, sharedEmotions: ['anxiety'], supportMode: 'Vent Mode', bio: 'Dealing with chronic anxiety. Your feelings are valid here.' },
];

const analyzeEntry = (content: string): Partial<JournalEntry> => {
  const lower = content.toLowerCase();
  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself', 'not worth living'];
  const highRisk = crisisKeywords.some(k => lower.includes(k));
  const negativeWords = ['sad', 'anxious', 'depressed', 'lonely', 'stressed', 'overwhelmed', 'tired', 'hopeless', 'worried', 'afraid'];
  const positiveWords = ['happy', 'grateful', 'peaceful', 'hopeful', 'better', 'calm', 'good', 'joyful'];
  const negScore = negativeWords.filter(w => lower.includes(w)).length;
  const posScore = positiveWords.filter(w => lower.includes(w)).length;

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let sentimentScore = 0.5;
  if (negScore > posScore) { sentiment = 'negative'; sentimentScore = Math.max(0.1, 0.5 - negScore * 0.07); }
  else if (posScore > negScore) { sentiment = 'positive'; sentimentScore = Math.min(0.95, 0.5 + posScore * 0.1); }

  const emotions: string[] = [];
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worried') || lower.includes('panic')) emotions.push('anxiety');
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('pressure')) emotions.push('stress');
  if (lower.includes('grief') || lower.includes('loss') || lower.includes('miss') || lower.includes('mourn')) emotions.push('grief');
  if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated') || lower.includes('disconnected')) emotions.push('loneliness');
  if (lower.includes('burnout') || lower.includes('exhaust') || lower.includes('drained') || lower.includes('tired')) emotions.push('burnout');
  if (emotions.length === 0 && negScore > 0) emotions.push('stress');
  if (emotions.length === 0) emotions.push('loneliness');

  return { emotions, sentiment, sentimentScore, riskLevel: highRisk ? 'high' : negScore > 4 ? 'medium' : 'low', riskFlag: highRisk };
};

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      content: 'Feeling overwhelmed today. Work has been stressful and I can\'t seem to switch off.',
      timestamp: new Date(Date.now() - 86400000 * 2),
      emotions: ['stress', 'burnout'],
      sentiment: 'negative',
      sentimentScore: 0.25,
      riskLevel: 'low',
      riskFlag: false,
      supportMode: 'vent',
    },
    {
      id: '2',
      content: 'A bit anxious about the upcoming week but trying to stay calm and breathe through it.',
      timestamp: new Date(Date.now() - 86400000),
      emotions: ['anxiety'],
      sentiment: 'neutral',
      sentimentScore: 0.45,
      riskLevel: 'low',
      riskFlag: false,
      supportMode: 'advice',
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<MatchedPeer | null>(null);

  const addEntry = async (content: string, supportMode: 'vent' | 'advice' | 'accountability'): Promise<JournalEntry> => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    const analysis = analyzeEntry(content);
    const entry: JournalEntry = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      emotions: analysis.emotions || ['stress'],
      sentiment: analysis.sentiment || 'neutral',
      sentimentScore: analysis.sentimentScore || 0.5,
      riskLevel: analysis.riskLevel || 'low',
      riskFlag: analysis.riskFlag || false,
      supportMode,
    };
    setEntries(prev => [entry, ...prev]);
    setIsAnalyzing(false);
    return entry;
  };

  const findMatch = async (entry: JournalEntry): Promise<MatchedPeer | null> => {
    setIsMatching(true);
    await new Promise(r => setTimeout(r, 2500));
    const modeMap = { vent: 'Vent Mode', advice: 'Advice Mode', accountability: 'Accountability Mode' };
    const filtered = mockPeers.filter(p => !entry.supportMode || p.supportMode === modeMap[entry.supportMode]);
    const match = filtered.length > 0 ? filtered[0] : mockPeers[0];
    const withShared = { ...match, sharedEmotions: entry.emotions.slice(0, 2) };
    setCurrentMatch(withShared);
    setIsMatching(false);
    return withShared;
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, isAnalyzing, currentMatch, setCurrentMatch, findMatch, isMatching }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used within JournalProvider');
  return ctx;
};
