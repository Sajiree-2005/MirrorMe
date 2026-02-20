import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Brain, ArrowRight, Star, CheckCircle } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

const features = [
  { icon: Brain, title: 'AI Emotional Analysis', desc: 'NLP understands your journal entries and detects emotions like anxiety, stress, and grief with precision.' },
  { icon: Users, title: 'Smart Peer Matching', desc: 'Cosine similarity matching connects you with someone who truly understands what you\'re going through.' },
  { icon: Shield, title: 'Safety First', desc: 'Crisis detection, toxicity filtering, and emergency resources keep every interaction safe.' },
  { icon: Heart, title: 'Anonymous & Private', desc: 'You\'re always known by a generated anonymous name. No real identities, just real support.' },
];

const testimonials = [
  { name: 'TranquilRiver42', text: 'For the first time, I felt truly heard. My match experienced the exact same burnout cycle.', emotion: 'burnout' },
  { name: 'SoftEcho19', text: 'The AI matched us perfectly. We both struggle with social anxiety and understood each other immediately.', emotion: 'anxiety' },
  { name: 'GentleBreeze77', text: 'The anonymity made it safe to be completely honest. This platform changed how I cope.', emotion: 'grief' },
];

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary shadow-glow">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-serif font-semibold text-foreground">MirrorMe</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth?mode=login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign in</Button>
          </Link>
          <Link to="/auth?mode=register">
            <Button className="gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 rounded-xl px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Shield className="w-3.5 h-3.5" />
              Safe · Anonymous · AI-Powered
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-tight">
              Find Someone Who
              <span className="block" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Truly Understands
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              MirrorMe uses AI to analyze your emotional journal entries and match you with peers experiencing similar challenges — anonymously and safely.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth?mode=register">
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-elevated hover:shadow-glow transition-all duration-300 rounded-xl gap-2 px-8 py-6 text-base animate-pulse-glow">
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-base border-border">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {['Completely free', '100% anonymous', 'AI moderated'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block animate-float">
            <img
              src={heroIllustration}
              alt="Two people connected through flowing waves representing emotional understanding"
              className="rounded-3xl shadow-elevated w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-serif font-semibold text-foreground mb-4">How MirrorMe Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI-powered emotional intelligence meets human compassion.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-base font-serif font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Modes */}
      <section className="py-20 px-6 gradient-lavender">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-serif font-semibold text-foreground mb-4">Choose Your Support Mode</h2>
            <p className="text-muted-foreground text-lg">Every conversation is tailored to your needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { mode: 'Vent Mode', emoji: '💬', desc: 'Just need to be heard? Find a compassionate listener who gets it.', color: 'text-primary' },
              { mode: 'Advice Mode', emoji: '💡', desc: 'Looking for guidance? Connect with someone who has navigated similar challenges.', color: 'text-accent' },
              { mode: 'Accountability Mode', emoji: '🤝', desc: 'Stay on track together. Mutual support for shared goals and healing.', color: 'text-success' },
            ].map(({ mode, emoji, desc, color }) => (
              <div key={mode} className="p-6 rounded-2xl bg-card shadow-card border border-border text-center hover:shadow-elevated transition-all duration-300">
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className={`text-lg font-serif font-semibold mb-2 ${color}`}>{mode}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-serif font-semibold text-foreground mb-4">Real Connections, Real Healing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map(({ name, text, emotion }) => (
              <div key={name} className="p-6 rounded-2xl border border-border bg-background shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-warning fill-warning" />)}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full emotion-${emotion}`}>{emotion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-semibold text-primary-foreground mb-4">You Don't Have to Face This Alone</h2>
          <p className="text-primary-foreground/80 text-xl mb-8 max-w-xl mx-auto">
            Join thousands of people finding meaningful peer connections through AI-powered emotional matching.
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="bg-card text-foreground hover:bg-muted rounded-xl px-10 py-6 text-base font-semibold shadow-elevated">
              Start for Free <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-foreground/5 border-t border-border text-center">
        <p className="text-muted-foreground text-sm">
          © 2024 MirrorMe · If you're in crisis, please call{' '}
          <a href="tel:988" className="text-primary font-medium hover:underline">988 (Crisis Lifeline)</a>
          {' '}or{' '}
          <a href="tel:911" className="text-destructive font-medium hover:underline">911</a>
        </p>
      </footer>
    </div>
  );
};
