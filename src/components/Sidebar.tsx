import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, BookOpen, Users, MessageCircle, User, LogOut, Heart, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Journal', icon: BookOpen, path: '/journal' },
  { label: 'Find Match', icon: Users, path: '/match' },
  { label: 'Chat', icon: MessageCircle, path: '/chat' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border shadow-card">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary shadow-glow">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-serif font-semibold text-sidebar-foreground leading-tight">MirrorMe</h1>
          <p className="text-xs text-muted-foreground">Peer Support</p>
        </div>
      </div>

      {/* User badge */}
      {user && (
        <div className="mx-4 my-4 px-4 py-3 rounded-xl bg-sidebar-accent border border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-primary/20" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.anonymousName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" /> Anonymous
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <div className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-soft'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Safety badge */}
      <div className="mx-4 mb-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20">
        <div className="flex items-center gap-2 text-xs text-success font-medium">
          <Shield className="w-3 h-3" />
          Safe & Moderated Space
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI monitors all interactions</p>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/8">
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
};
