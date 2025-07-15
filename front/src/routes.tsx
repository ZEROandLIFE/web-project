import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './MainLayout';

const LoginPage = lazy(() => import('./authPages/LoginPage'));
const RegisterPage = lazy(() => import('./authPages/RegisterPage'));
const DashboardPage =lazy(() => import('./authPages/DashboardPage'));
const NotFoundPage = lazy(() => import('./head/NotFoundPage'));
export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        element: <MainLayout />, // 包含导航栏的布局
        children: [
            {
                path: '/dashboard',
                element: <DashboardPage />,
            },

        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },


]);