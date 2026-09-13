import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundView({ onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-16 rounded-xl bg-muted dark:dark:bg-stone-800 flex items-center justify-center mb-4 shadow-lg">
        <AlertCircle className="size-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        Page Not Found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={onGoHome}
      >
        <Home className="size-4 mr-2" />
        Go to Home
      </Button>
    </div>
  );
}
