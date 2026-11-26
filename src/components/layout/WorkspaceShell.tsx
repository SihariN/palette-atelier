
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Accessibility,
  ChevronLeft,
  Image,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Palette,
  PanelsTopLeft,
  Paintbrush,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navigation = [
  {
    label: "WORKSPACE",
    items: [
      { name: "Overview", href: "/atelier", icon: LayoutDashboard },
      {
        name: "Palette Studio",
        href: "/atelier/palette-studio",
        icon: Palette,
      },
      {
        name: "Image Extractor",
        href: "/atelier/image-extractor",
        icon: Image,
      },
      {
        name: "Moodboard Creator",
        href: "/atelier/moodboards",
        icon: PanelsTopLeft,
      },
      {
        name: "Canvas Editor",
        href: "/atelier/canvas",
        icon: Paintbrush,
      },
      {
        name: "Accessibility",
        href: "/atelier/accessibility",
        icon: Accessibility,
      },
    ],
  },
  {
    label: "PERSONAL",
    items: [
      {
        name: "My Library",
        href: "/atelier/library",
        icon: Library,
      },
      {
        name: "Settings",
        href: "/atelier/settings",
        icon: Settings,
      },
    ],
  },
];

export default function WorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!error) {
        setUser(data.user);
      }

      setAccountLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccountLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLogoutError("Unable to sign out. Please try again.");
      setLoggingOut(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/atelier") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#e8e5dc] bg-[#fbfaf6] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/atelier" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8ecdf] text-[#78836a]">
              <Palette size={21} />
            </div>

            <div>
              <p className="font-semibold tracking-tight">
                Palette Atelier
              </p>
              <p className="text-[10px] tracking-[0.15em] text-[#99968b]">
                YOUR CREATIVE STUDIO
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="text-[#858479] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-12 flex-1 space-y-9">
          {navigation.map((section) => (
            <div key={section.label}>
              <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#aaa69a]">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-colors ${
                        active
                          ? "bg-[#e8ecdf] font-medium text-[#657257]"
                          : "text-[#858479] hover:bg-[#f0eee7] hover:text-[#353630]"
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.8} />
                      {item.name}

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#89947a]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#efede6] p-4">
          <div className="flex items-center gap-2 text-[#7d866e]">
            <Sparkles size={15} />
            <span className="text-xs font-medium">A little inspiration</span>
          </div>

          <p className="mt-2 text-xs leading-5 text-[#858479]">
            Great things begin with a little creativity.
          </p>
        </div>

        {/* Signed-in account */}
        <div className="mt-4 rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8ecdf] text-[#78836a]">
              <UserRound size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium tracking-[0.12em] text-[#aaa69a]">
                SIGNED IN AS
              </p>

              <p
                className="mt-1 truncate text-xs font-medium text-[#55564d]"
                title={user?.email ?? ""}
              >
                {accountLoading
                  ? "Loading account..."
                  : user?.email ?? "Account unavailable"}
              </p>
            </div>
          </div>

          {logoutError && (
            <p role="alert" className="mt-3 text-[11px] text-red-600">
              {logoutError}
            </p>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut || accountLoading || !user}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8e5dc] px-3 py-2.5 text-xs font-medium text-[#858479] transition hover:border-[#d5aaa3] hover:bg-[#f9eeeb] hover:text-[#9b655d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={14} />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>

        <p className="mt-5 text-center text-[10px] text-[#aaa69a]">
          PALETTE ATELIER · V1.0
        </p>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e8e5dc] bg-[#f7f5f0]/95 px-5 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-[#77776b] hover:bg-[#efede6] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-sm font-medium text-[#353630]">
                {navigation
                  .flatMap((section) => section.items)
                  .find((item) => isActive(item.href))?.name ??
                  "Workspace"}
              </p>

              <p className="text-[11px] text-[#99968b]">
                Your space to explore and create
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#858479] transition-colors hover:text-[#353630]"
          >
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">Welcome page</span>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-5 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

