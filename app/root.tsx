import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";

import { AppSidebar, menuItems } from "~/components/app-sidebar";
import { Separator } from "~/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  const title = menuItems[location.pathname]?.title || "";

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col h-dvh">
        <header className="h-8 relative flex justify-center items-center text-sidebar-foreground/70">
          <SidebarTrigger className="absolute top-[2px] left-2" />
          <h1 className="text-xs font-medium">{title}</h1>
        </header>
        <Separator />
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
