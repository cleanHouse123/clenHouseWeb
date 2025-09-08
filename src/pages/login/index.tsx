import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
    debugger
    // Редиректим на главную страницу, так как SMS логин теперь модальное окно
    return <Navigate to="/" replace />;
};
