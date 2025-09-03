import { Button } from '../button';

interface RateLimitPageProps {
  onRetry: () => void;
}

export const RateLimitPage = ({ onRetry }: RateLimitPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="bg-background rounded-[24px] p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Превышен лимит запросов
          </h1>
          <p className="text-muted-foreground">
            Слишком много запросов. Попробуйте позже.
          </p>
        </div>

        <Button
          onClick={onRetry}
          className="w-full"
        >
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}; 