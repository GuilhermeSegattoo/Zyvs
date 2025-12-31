'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Como funciona o período de teste?',
    answer: 'Você tem 14 dias para testar todos os recursos do plano Pro gratuitamente, sem precisar cadastrar cartão de crédito. Após o período de teste, você pode escolher continuar com o plano Pro ou usar o plano gratuito.'
  },
  {
    question: 'Posso mudar de plano depois?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.'
  },
  {
    question: 'Como funciona a integração com WhatsApp?',
    answer: 'Utilizamos a API oficial do WhatsApp Business. Você precisará de uma conta verificada do WhatsApp Business para conectar. O processo de integração é simples e guiado, levando menos de 5 minutos.'
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Utilizamos criptografia de ponta a ponta, servidores seguros e fazemos backups diários. Seus dados estão protegidos de acordo com a LGPD e nunca são compartilhados com terceiros.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas de cancelamento. Seus dados ficam disponíveis por 30 dias após o cancelamento.'
  },
  {
    question: 'Tem suporte em português?',
    answer: 'Sim! Todo nosso suporte é em português. Planos Free têm suporte por email com resposta em até 24h. Planos Pro têm suporte prioritário e planos Business têm suporte 24/7.'
  },
  {
    question: 'Preciso saber programar?',
    answer: 'Não! O Thumdra foi desenvolvido para ser usado por qualquer pessoa. Todas as automações são criadas visualmente, com drag-and-drop, sem necessidade de código.'
  },
  {
    question: 'Quais métodos de pagamento são aceitos?',
    answer: 'Aceitamos cartão de crédito, PIX e boleto bancário. Para planos anuais, oferecemos 20% de desconto em qualquer forma de pagamento.'
  }
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = index % 3 === 0 ? 'rotate-1' : index % 2 === 0 ? '-rotate-1' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ x: 4, y: -4 }}
      className={`bg-white brutal-border brutal-shadow hover:brutal-shadow-lg transition-all ${rotation}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
      >
        <span className="font-bold text-gray-900 uppercase text-sm md:text-base tracking-wide">
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center brutal-border ${isOpen ? 'bg-[#00ff88]' : 'bg-white'} transition-colors`}>
          {isOpen ? (
            <Minus className="w-5 h-5" strokeWidth={3} />
          ) : (
            <Plus className="w-5 h-5" strokeWidth={3} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t-3 border-black"
          >
            <div className="px-6 py-5 text-gray-700 leading-relaxed font-medium">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-32 bg-white grid-bg">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6 -rotate-1"
          >
            <div className="px-5 py-2 bg-[#ffeb3b] brutal-border brutal-shadow-sm font-bold uppercase text-sm">
              PERGUNTAS FREQUENTES
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            DÚVIDAS?
            <br />
            <span className="text-[#00ff88]">RESPOSTAS.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl font-medium text-gray-700"
          >
            Tudo que você precisa saber sobre o Thumdra
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Contact support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-block bg-white brutal-border brutal-shadow p-8 rotate-1">
            <p className="text-sm font-bold uppercase mb-4 text-gray-600">
              NÃO ENCONTROU O QUE PROCURAVA?
            </p>
            <a
              href="mailto:suporte@thumdra.com.br"
              className="inline-block"
            >
              <motion.button
                whileHover={{ x: 4, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-[#00ff88] brutal-border-thick brutal-shadow font-extrabold uppercase text-sm tracking-wide hover:bg-gray-900 transition-colors"
              >
                FALAR COM SUPORTE →
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
