import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useJournal } from '@/context/JournalContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageCircle, Flame, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const emotionColors: Record<string, string> = {
  anxiety: '#f59e0b',
  stress: '#ef4444',
  grief: '#6366f1',
  loneliness: '#8b5cf6',
  burnout: '#dc2626',
  positive: '#10b981',
};

const moodData = [
  { day: 'Mon', score: 0.4, label: 'Stressed' },
  { day: 'Tue', score: 0.35, label: 'Anxious' },
  { day: 'Wed', score: 0.55, label: 'Neutral' },
  { day: 'Thu', score: 0.45, label: 'Low' },
  { day: 'Fri', score: 0.6, label: 'Better' },
  { day: 'Sat', score: 0.72, label: 'Good' },
  { day: 'Sun', score: 0.65, label: 'Calm' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const mood = val > 0.7 ? 'Positive' : val > 0.5 ? 'Neutral' : val > 0.35 ? 'Low' : 'Difficult';
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-elevated text-sm">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">Mood: <span className="text-foreground">{mood}</span></p>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { entries } = useJournal();
  const latestEntry = entries[0];
  const streak = 7;
  const sessions = 3;
  const hasRisk = latestEntry?.riskFlag;

  const allEmotions = entries.flatMap(e => e.emotions);
  const emotionCounts = allEmotions.reduce((acc, em) => ({ ...acc, [em]: (acc[em] || 0) + 1 }), {} as Record<string, number>);
  const topEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">
              Hello, {user?.anonymousName?.split(/\d/)[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1">How are you feeling today?</p>
          </div>
          <Link to="/journal">
            <Button className="gradient-primary text-primary-foreground rounded-xl shadow-soft hover:shadow-glow transition-all gap-2">
              <BookOpen className="w-4 h-4" /> Write in Journal
            </Button>
          </Link>
        </div>

        {/* Crisis alert */}
        {hasRisk && (
          <div className="mb-6 p-4 rounded-2xl bg-crisis-light border border-crisis/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-crisis flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-crisis">We noticed some difficult feelings in your last entry</p>
              <p className="text-sm text-foreground/70 mt-0.5">
                Please know you're not alone. Call <strong>988</strong> (Crisis Lifeline) or text HOME to 741741 for immediate support.
              </p>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Journal Streak', value: `${streak} days`, icon: Flame, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Support Sessions', value: `${sessions} total`, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Journal Entries', value: `${entries.length} total`, icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-serif font-semibold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Emotional Trend Chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-serif font-semibold text-foreground">Emotional Trend</h2>
                <p className="text-sm text-muted-foreground">Your mood over the past 7 days</p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(225 60% 58%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(225 60% 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(220 15% 55%)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 12, fill: 'hsl(220 15% 55%)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="hsl(225 60% 58%)" fill="url(#moodGrad)" strokeWidth={2.5} dot={{ fill: 'hsl(225 60% 58%)', r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Emotions breakdown */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="text-lg font-serif font-semibold text-foreground mb-4">Top Emotions</h2>
            {topEmotions.length > 0 ? (
              <div className="space-y-3">
                {topEmotions.map(([emotion, count]) => (
                  <div key={emotion} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium emotion-${emotion}`}>{emotion}</span>
                      <span className="text-muted-foreground">{count}x</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(count / allEmotions.length) * 100}%`, backgroundColor: emotionColors[emotion] || 'hsl(225 60% 58%)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Write your first journal entry to see emotional insights.</p>
            )}
          </div>
        </div>

        {/* Recent entries + quick actions */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Recent journal */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-foreground">Recent Entries</h2>
              <Link to="/journal" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {entries.slice(0, 3).map(entry => (
                <div key={entry.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{entry.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {entry.emotions.slice(0, 2).map(em => (
                      <span key={em} className={`text-xs px-2 py-0.5 rounded-full emotion-${em}`}>{em}</span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No entries yet. Start journaling!</p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="text-lg font-serif font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'Write a journal entry', sub: 'Process your emotions with AI', icon: BookOpen, href: '/journal', color: 'text-primary bg-primary/10' },
                { label: 'Find a peer match', sub: 'Connect with someone like you', icon: Users, href: '/match', color: 'text-accent bg-accent/10' },
                { label: 'Continue chat session', sub: 'Safe, anonymous peer chat', icon: MessageCircle, href: '/chat', color: 'text-success bg-success/10' },
              ].map(({ label, sub, icon: Icon, href, color }) => (
                <Link key={href} to={href}>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
