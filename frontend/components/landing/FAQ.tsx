'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-gray-900 pr-8">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-purple-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 leading-relaxed">
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
    <section id="faq" className="relative py-32 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Perguntas{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre o Thumdra
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
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
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Não encontrou o que procurava?
          </p>
          <a
            href="mailto:suporte@thumdra.com.br"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition"
          >
            Entre em contato com nosso suporte →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
