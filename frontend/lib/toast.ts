import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, options?: { description?: string }) => {
    sonnerToast.success(message, {
      description: options?.description,
    });
  },

  error: (message: string, options?: { description?: string }) => {
    sonnerToast.error(message, {
      description: options?.description,
    });
  },

  warning: (message: string, options?: { description?: string }) => {
    sonnerToast.warning(message, {
      description: options?.description,
    });
  },

  info: (message: string, options?: { description?: string }) => {
    sonnerToast.info(message, {
      description: options?.description,
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};
