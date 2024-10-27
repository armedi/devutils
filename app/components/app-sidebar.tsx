import { Link, useLocation } from "@remix-run/react";
import { Binary, Clock, LucideProps } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export const menuItems: Record<
  string,
  {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }
> = {
  "/number-base-converter": {
    title: "Number Base Converter",
    url: "/number-base-converter",
    icon: Binary,
  },
  "/unix-time-converter": {
    title: "Unix Time Converter",
    url: "/unix-time-converter",
    icon: Clock,
  },
};

const menuItemsValues = Object.values(menuItems);

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>DevUtils</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItemsValues.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.url === location.pathname}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
