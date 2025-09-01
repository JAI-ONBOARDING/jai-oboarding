import React from "react";
import {
  Building,
  Link as LinkIcon,
  FileText,
  MessageCircle,
  Bot,
  HelpCircle,
} from "lucide-react";

interface SideNavigationProps {
  active: string;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

const menu = [
  { id: "empresa", label: "Empresa", icon: Building },
  { id: "contratos", label: "Contratos", icon: FileText },
  { id: "integracao", label: "Integração", icon: LinkIcon },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "robo", label: "Robô", icon: Bot },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const SideNavigation: React.FC<SideNavigationProps> = ({
  active,
  sectionRefs,
}) => {
  return (
    <nav
      aria-label="Navegação de seções"
      className="fixed right-4 top-24 hidden lg:block"
    >
      <ul className="rounded-2xl border bg-background/70 backdrop-blur p-2 w-56">
        {menu.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => {
                const element = sectionRefs.current[m.id];
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                active === m.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <m.icon className="w-4 h-4" /> {m.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNavigation;
