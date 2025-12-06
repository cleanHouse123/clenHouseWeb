import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';

interface ErrorPageProps {
    error?: Error | null;
    onReset?: () => void;
}

export const ErrorPage = ({ error, onReset }: ErrorPageProps) => {

    const handleReload = () => {
        if (onReset) {
            onReset();
        }
        window.location.reload();
    };

    const errorMessage = error?.message || 'Неизвестная ошибка';

    const isChunkError = errorMessage?.includes('Failed to fetch dynamically imported module') ||
        errorMessage?.includes('Loading chunk') ||
        error?.name === 'ChunkLoadError';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4" dir="rtl">
            <Card className="w-full max-w-md" radius="r24" padding="xl" background="white" bordered shadow>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        Произошла ошибка
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {isChunkError
                            ? 'Не удалось загрузить необходимые файлы приложения. Это может быть связано с проблемами сети или устаревшей версией страницы.'
                            : 'Что-то пошло не так. Мы уже работаем над решением проблемы.'}
                    </p>
                    {error && process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-xs text-gray-500 mb-2">
                                Детали ошибки (только для разработки)
                            </summary>
                            <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-40 text-gray-800">
                                {error.toString()}
                            </pre>
                        </details>
                    )}
                    <div className="pt-4">
                        <Button
                            onClick={handleReload}
                            variant="primary"
                            size="lg"
                            className="w-full"
                        >
                            <svg
                                className="w-5 h-5 ml-2 inline-block"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Перезагрузить страницу
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

