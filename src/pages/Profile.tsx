import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useJournal } from '@/context/JournalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Bell, Lock, User, Trash2, CheckCircle, Moon } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const { entries } = useJournal();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareAnonymous, setShareAnonymous] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const emotions = entries.flatMap(e => e.emotions);
  const dominantEmotion = emotions.length > 0
    ? Object.entries(emotions.reduce((a, e) => ({ ...a, [e]: (a[e] || 0) + 1 }), {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your anonymous identity and preferences.</p>
        </div>

        {/* Profile card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <img src={user?.avatar} alt="avatar" className="w-16 h-16 rounded-2xl ring-2 ring-primary/20" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-success-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-foreground">{user?.anonymousName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">Anonymous Identity Protected</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Journal Entries', value: entries.length },
              { label: 'Sessions', value: 3 },
              { label: 'Streak', value: '7 days' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-2xl font-serif font-semibold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {dominantEmotion && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                Your dominant emotion this week: <span className={`font-semibold capitalize emotion-${dominantEmotion} px-2 py-0.5 rounded-full ml-1`}>{dominantEmotion}</span>
              </p>
            </div>
          )}
        </div>

        {/* Anonymous settings */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-semibold text-foreground">Privacy & Anonymity</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Anonymous Display Name</p>
                <p className="text-xs text-muted-foreground">Your anonymous identity in peer sessions</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-muted text-sm font-mono text-foreground">{user?.anonymousName}</div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Share anonymized emotional data</p>
                <p className="text-xs text-muted-foreground">Help improve matching (no personal info shared)</p>
              </div>
              <Switch checked={shareAnonymous} onCheckedChange={setShareAnonymous} />
            </div>
            <div className="h-px bg-border" />
            <div className="p-4 rounded-xl bg-success/8 border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-success" />
                <p className="text-sm font-semibold text-success">Your Privacy Guarantee</p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Real name never shared with peers</li>
                <li>Journal content never visible to others</li>
                <li>Embeddings are anonymous vectors only</li>
                <li>You can delete all data at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-semibold text-foreground">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Journal reminders</p>
                <p className="text-xs text-muted-foreground">Daily prompts to check in with yourself</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Dark mode</p>
                <p className="text-xs text-muted-foreground">Easier on the eyes in low light</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card rounded-2xl border border-destructive/20 shadow-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-serif font-semibold text-foreground">Delete Account</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl">
            Delete My Account
          </Button>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleSave}
            className="gradient-primary text-primary-foreground rounded-xl shadow-soft hover:shadow-glow transition-all gap-2 px-8"
          >
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save Settings'}
          </Button>
          <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive">
            Sign out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
