import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wrench, Inbox, LogOut, Loader2, ArrowLeft, Banknote, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SiteLogo, RuegenIcon } from '@/components/SiteLogo';

const items = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, end: true },
  { title: 'Fahrzeuge', url: '/admin/fahrzeuge', icon: Car, end: false },
  { title: 'Anfragen', url: '/admin/anfragen', icon: Inbox, end: false },
  { title: 'Prüfstand', url: '/admin/pruefstand', icon: Wrench, end: false },
  { title: 'Ankauf', url: '/admin/ankauf', icon: Banknote, end: false },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-[hsl(var(--brand-dark))] text-white">
        <div className={`px-4 py-5 border-b border-white/10 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? (
            <Link to="/" aria-label="exclusiv Automobile Rügen" className="inline-flex">
              <RuegenIcon className="h-5 w-10 text-[hsl(var(--brand-gold))] mx-auto" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <SiteLogo size="sm" />
              <span className="font-display tracking-[0.2em] text-white/60 text-[10px] uppercase">
                Admin
              </span>
            </div>
          )}
        </div>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-white/40">Verwaltung</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${isActive ? 'bg-[hsl(var(--brand-gold))]/20 text-brand-gold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t border-white/10 p-2 space-y-1">
          <SidebarMenuButton asChild>
            <Link to="/" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
              {!collapsed && <span>Zur Website</span>}
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton onClick={() => signOut()} className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Abmelden</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
      </div>
    );
  }
  if (!user) return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-display text-3xl mb-3">Kein Zugriff</h1>
        <p className="text-muted-foreground mb-6">Dieser Bereich ist nur für Administratoren verfügbar.</p>
        <Button asChild variant="outline"><Link to="/">Zurück zur Startseite</Link></Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-background px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin · exclusiv Automobile Rügen</span>
          </header>
          <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}