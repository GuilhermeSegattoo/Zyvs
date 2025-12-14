'use client';

import * as React from 'react';
import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from '@/components/ui/floating-icons-hero-section';
import {
  MessageSquare,
  Users,
  Workflow,
  Mail,
  Instagram,
  Calendar,
  BarChart3,
  Zap,
  Phone,
  Tag,
  TrendingUp,
  Settings,
  Bell,
  Target,
  Sparkles,
  Database,
} from 'lucide-react';

// Icon wrapper component to make lucide-react icons compatible with the hero
const IconWrapper = (Icon: React.FC<any>) => {
  return (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props} strokeWidth={1.5} />
  );
};

// Define the icons with their unique positions
const heroIcons: FloatingIconsHeroProps['icons'] = [
  { id: 1, icon: IconWrapper(MessageSquare), className: 'top-[10%] left-[10%]' },
  { id: 2, icon: IconWrapper(Users), className: 'top-[20%] right-[8%]' },
  { id: 3, icon: IconWrapper(Workflow), className: 'top-[80%] left-[10%]' },
  { id: 4, icon: IconWrapper(Mail), className: 'bottom-[10%] right-[10%]' },
  { id: 5, icon: IconWrapper(Instagram), className: 'top-[5%] left-[30%]' },
  { id: 6, icon: IconWrapper(Calendar), className: 'top-[5%] right-[30%]' },
  { id: 7, icon: IconWrapper(BarChart3), className: 'bottom-[8%] left-[25%]' },
  { id: 8, icon: IconWrapper(Zap), className: 'top-[40%] left-[15%]' },
  { id: 9, icon: IconWrapper(Phone), className: 'top-[75%] right-[25%]' },
  { id: 10, icon: IconWrapper(Tag), className: 'top-[90%] left-[70%]' },
  { id: 11, icon: IconWrapper(TrendingUp), className: 'top-[50%] right-[5%]' },
  { id: 12, icon: IconWrapper(Settings), className: 'top-[55%] left-[5%]' },
  { id: 13, icon: IconWrapper(Bell), className: 'top-[5%] left-[55%]' },
  { id: 14, icon: IconWrapper(Target), className: 'bottom-[5%] right-[45%]' },
  { id: 15, icon: IconWrapper(Sparkles), className: 'top-[25%] right-[20%]' },
  { id: 16, icon: IconWrapper(Database), className: 'top-[60%] left-[30%]' },
];

export default function FloatingHero() {
  return (
    <FloatingIconsHero
      title="Automatize seu CRM"
      subtitle="Gerencie contatos, automatize mensagens no WhatsApp, crie fluxos inteligentes e acompanhe seu pipeline de vendas. Tudo em uma plataforma."
      ctaText="Começar Grátis"
      ctaHref="/cadastro"
      icons={heroIcons}
    />
  );
}
