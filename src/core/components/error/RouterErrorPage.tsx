import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';

export const RouterErrorPage = () => {
    const routeError = useRouteError();
    const error = routeError instanceof Error ? routeError : null;
    const routeErrorResponse = isRouteErrorResponse(routeError) ? routeError : null;

    const errorMessage = routeErrorResponse?.statusText || 
        routeErrorResponse?.data?.message || 
        error?.message || 
        (typeof routeError === 'object' && routeError !== null && 'message' in routeError 
            ? String(routeError.message) 
            : 'Неизвестная ошибка');

    const isChunkError = errorMessage?.includes('Failed to fetch dynamically imported module') ||
        errorMessage?.includes('Loading chunk') ||
        error?.name === 'ChunkLoadError';

    return (
        <ErrorPage 
            error={error || (routeError ? new Error(errorMessage) : null)} 
        />
    );
};

