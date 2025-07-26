import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './MainLayout';

const LoginPage = lazy(() => import('./authPages/LoginPage'));
const RegisterPage = lazy(() => import('./authPages/RegisterPage'));
const DashboardPage =lazy(() => import('./authPages/DashboardPage'));
const NotFoundPage = lazy(() => import('./head/NotFoundPage'));
const Home=lazy(()=>import('./blindBox/home'));
const CreateBox=lazy(()=>import('./blindBox/Box/createbox'));
const BoxDetail = lazy(() => import('./blindBox/Box/boxdetail'));
const OrderPage=lazy(() =>import ('./blindBox/orderPage'));
const Warehouse=lazy(()=>import('./blindBox/warehouse'));
const ShowPage =lazy(()=>import('./blindBox/showPage'));
const AdminOrderPage=lazy(()=>import('./blindBox/AdminOrderPage'))
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
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/createbox',
                element: <CreateBox />,

            },
            {
                path: '/boxdetail/:boxId',
                element: <BoxDetail />,
            },
            {
                path: '/order',
                element: <OrderPage />,
            },
            {
                path: '/adminorder',
                element: <AdminOrderPage />,
            },
            {
                path: '/warehouse',
                element: <Warehouse />,
            },
            {
                path: '/show',
                element: <ShowPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },



]);