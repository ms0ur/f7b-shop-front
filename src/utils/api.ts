import axiosInstance from './axiosInstance';
import type { Product } from '@/types/Product.interface';
import type { Order } from '@/types/Order.interface';
import type { User } from '@/types/User.interface';

export const api = {
    getProducts: async () => {
        const { data } = await axiosInstance.get<Product[]>('/product/');
        return data;
    },
    getProductById: async (id: string) => {
        const { data } = await axiosInstance.get<Product>(`/product/${id}`);
        return data;
    },
    createProduct: async (productData: Partial<Product>) => {
        const { data } = await axiosInstance.post<Product>('/product/', productData);
        return data;
    },
    updateProduct: async (id: string, productData: Partial<Product>) => {
        const { data } = await axiosInstance.put<Product>(`/product/${id}`, productData);
        return data;
    },
    deleteProduct: async (id: string) => {
        await axiosInstance.delete(`/product/${id}`);
    },

    getUsers: async () => {
        const { data } = await axiosInstance.get<User[]>('/users/');
        return data;
    },
    getUserById: async (id: string) => {
        const { data } = await axiosInstance.get<User>(`/users/${id}`);
        return data;
    },
    updateUser: async (id: string, userData: Partial<User>) => {
        const { data } = await axiosInstance.put<User>(`/users/${id}`, userData);
        return data;
    },
    deleteUser: async (id: string) => {
        await axiosInstance.delete(`/users/${id}`);
    },

    getOrders: async () => {
        const { data } = await axiosInstance.get<Order[]>('/orders/');
        return data;
    },
    getOrderById: async (id: string) => {
        const { data } = await axiosInstance.get<Order>(`/orders/${id}`);
        return data;
    },
    createOrder: async (orderData: Omit<Order, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const { data } = await axiosInstance.post<Order>('/orders/', { ...orderData, id });
        return data;
    },
    updateOrder: async (id: string, orderData: Partial<Order>) => {
        const { data } = await axiosInstance.put<Order>(`/orders/${id}`, orderData);
        return data;
    },
    deleteOrder: async (id: string) => {
        await axiosInstance.delete(`/orders/${id}`);
    },
};
