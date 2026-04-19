export const nav = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "grid",
  },
  {
    href: "/accounts",
    label: "Ad accounts",
    icon: "wallet",
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    icon: "layers",
  },
  {
    href: "/rules",
    label: "Rules",
    icon: "sliders",
  },
  {
    href: "/audit",
    label: "Audit log",
    icon: "clipboard",
  },
] as const;

export type NavIcon = (typeof nav)[number]["icon"];
