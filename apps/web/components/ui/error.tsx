// apps/web/components/ui/error.tsx

import { AlertCircle } from 'lucide-react';
import { Button } from '@ecity/ui';

interface ErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

// Компонент помилки
export function ErrorMessage({ title, message, onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      <p className="text-sm text-gray-600 text-center max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Спробувати знову
        </Button>
      )}
    </div>
  );
}