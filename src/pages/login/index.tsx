import { Navigate } from 'react-router-dom';
import { SmsLoginPage } from '../sms-login';

export const LoginPage = () => {
    // Редиректим на SMS логин, так как это основной способ авторизации
    return <Navigate to="/sms-login" replace />;
};
