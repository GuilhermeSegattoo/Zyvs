'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          border: '2px solid black',
          borderRadius: '0',
          fontWeight: '600',
        },
        classNames: {
          success: 'bg-[#00ff88] text-black',
          error: 'bg-[#ff3366] text-white',
          warning: 'bg-[#ffeb3b] text-black',
          info: 'bg-white text-black',
        },
      }}
    />
  );
}
