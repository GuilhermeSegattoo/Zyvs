'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                  Z
                </div>
                <span className="text-xl font-bold text-white">
                  Zyva
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                CRM inteligente que transforma a forma como você se relaciona com seus clientes.
              </p>
            </motion.div>

            {/* Social */}
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#funcionalidades" className="hover:text-purple-400 transition text-sm">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="#planos" className="hover:text-purple-400 transition text-sm">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-purple-400 transition text-sm">
                  Teste Grátis
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition text-sm">
                  Roadmap
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-purple-400 transition text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition text-sm">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition text-sm">
                  Imprensa
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:contato@zyva.com.br" className="hover:text-purple-400 transition">
                  contato@zyva.com.br
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <a href="tel:+5511999999999" className="hover:text-purple-400 transition">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-purple-400 mt-1" />
                <span>
                  São Paulo, SP<br />
                  Brasil
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Zyva. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition">
                Termos de Uso
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition">
                Privacidade
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
