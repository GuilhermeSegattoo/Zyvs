'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const analysis = useMemo(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
    let color = 'red';
    let label = 'Muito Fraca';

    if (score >= 5) {
      strength = 'very-strong';
      color = 'green';
      label = 'Muito Forte';
    } else if (score >= 4) {
      strength = 'strong';
      color = 'emerald';
      label = 'Forte';
    } else if (score >= 3) {
      strength = 'medium';
      color = 'yellow';
      label = 'Média';
    }

    return { checks, score, strength, color, label };
  }, [password]);

  if (!password) return null;

  const requirements = [
    { key: 'length', label: 'Mínimo de 8 caracteres', met: analysis.checks.length },
    { key: 'uppercase', label: 'Letra maiúscula (A-Z)', met: analysis.checks.uppercase },
    { key: 'lowercase', label: 'Letra minúscula (a-z)', met: analysis.checks.lowercase },
    { key: 'number', label: 'Número (0-9)', met: analysis.checks.number },
    { key: 'special', label: 'Caractere especial (!@#$%)', met: analysis.checks.special },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      {/* Strength Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Força da senha:</span>
          <span className={`text-sm font-semibold text-${analysis.color}-600`}>
            {analysis.label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(analysis.score / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full bg-${analysis.color}-500`}
            style={{
              backgroundColor:
                analysis.color === 'red'
                  ? '#ef4444'
                  : analysis.color === 'yellow'
                  ? '#eab308'
                  : analysis.color === 'emerald'
                  ? '#10b981'
                  : '#22c55e',
            }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            <span className={req.met ? 'text-gray-900' : 'text-gray-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function isPasswordStrong(password: string): boolean {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ];

  return checks.filter(Boolean).length >= 4;
}
