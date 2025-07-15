import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
// import AuthLayout from './components/Auth/AuthLayout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
// const RegisterPage = lazy(() => import('./pages/RegisterPage'));


export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    // {
    //     path: '/register',
    //     element: <RegisterPage />,
    // },

]);