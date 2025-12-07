import { useState } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';

// Компонент, который выбрасывает ошибку при монтировании
const ErrorThrower = ({ errorType }: { errorType: string }) => {
    switch (errorType) {
        case 'render':
            throw new Error('Тестовая ошибка рендеринга компонента');
        case 'chunk':
            const chunkError = new Error('Failed to fetch dynamically imported module: http://localhost:5173/src/pages/dashboard/index.tsx?t=1765048925237');
            chunkError.name = 'ChunkLoadError';
            throw chunkError;
        case 'router':
            throw new Response('Страница не найдена', { status: 404 });
        default:
            throw new Error('Общая тестовая ошибка');
    }
};

export const ErrorTestPage = () => {
    const [errorType, setErrorType] = useState<string | null>(null);

    if (errorType) {
        return <ErrorThrower errorType={errorType} />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Тест страницы ошибок</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            Нажмите на кнопку, чтобы воспроизвести различные типы ошибок и увидеть страницу ошибки
                        </p>
                        
                        <div className="space-y-3">
                            <Button
                                onClick={() => setErrorType('render')}
                                variant="primary"
                                className="w-full"
                            >
                                Тест ошибки рендеринга (ErrorBoundary)
                            </Button>
                            
                            <Button
                                onClick={() => setErrorType('chunk')}
                                variant="primary"
                                className="w-full"
                            >
                                Тест ошибки загрузки чанка
                            </Button>
                            
                            <Button
                                onClick={() => setErrorType('router')}
                                variant="primary"
                                className="w-full"
                            >
                                Тест ошибки роутера (RouterErrorPage)
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Примечание:</strong> Эта страница доступна только для тестирования страницы ошибок.
                                После воспроизведения ошибки используйте кнопку "Перезагрузить страницу" для возврата.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

