'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Mail, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* Main Footer */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-14 h-14 bg-[#00ff88] flex items-center justify-center brutal-border">
                  <span className="text-black font-extrabold text-3xl">T</span>
                </div>
                <span className="text-3xl font-extrabold">THUMDRA</span>
              </div>
            </Link>
            <p className="text-xl font-bold mb-6 max-w-md leading-tight">
              O CRM QUE NÃO BRINCA EM SERVIÇO.
            </p>
            <p className="text-gray-400 mb-8 max-w-md">
              Automação profissional para empresas que querem resultados,
              não desculpas.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Github, href: 'https://github.com' },
                { icon: Mail, href: 'mailto:contato@thumdra.com.br' },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-[#00ff88] brutal-border hover:text-black transition-colors flex items-center justify-center group"
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-extrabold uppercase text-sm mb-6 text-[#00ff88]">Produto</h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'API', 'Integrações'].map((link) => (
                <li key={link}>
                  <Link href="#" className="font-bold uppercase text-sm hover:text-[#00ff88] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold uppercase text-sm mb-6 text-[#00ff88]">Empresa</h3>
            <ul className="space-y-3">
              {['Sobre', 'Blog', 'Carreiras', 'Contato'].map((link) => (
                <li key={link}>
                  <Link href="#" className="font-bold uppercase text-sm hover:text-[#00ff88] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Block */}
        <div className="mb-16 py-12 border-t border-b border-white/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                PRONTO PARA
                <br />
                <span className="text-[#00ff88]">CRESCER?</span>
              </h3>
              <p className="text-gray-400 font-bold">
                Teste grátis por 14 dias. Sem cartão.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/cadastro" className="flex-1">
                <button className="w-full px-8 py-5 bg-[#00ff88] text-black brutal-border-thick brutal-shadow-lg font-extrabold uppercase text-sm hover:bg-[#00ff88]/90 transition-colors">
                  COMEÇAR AGORA →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="flex flex-wrap gap-6 font-bold uppercase">
            <Link href="#" className="hover:text-[#00ff88] transition-colors">Termos</Link>
            <Link href="#" className="hover:text-[#00ff88] transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-[#00ff88] transition-colors">LGPD</Link>
          </div>
          <div className="font-bold uppercase">
            <span>© {currentYear} THUMDRA</span>
            <span className="mx-3">•</span>
            <span className="text-[#00ff88]">🇧🇷 MADE IN BRAZIL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
