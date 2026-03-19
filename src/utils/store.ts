import type { User } from "@/types/User.interface";
import type { Cart } from "@/types/Cart.interface";
import axiosInstance from "./axiosInstance";

const STORAGE_KEY_USER = 'f7b_user';
const STORAGE_KEY_CART = 'f7b_cart';
const STORAGE_KEY_ACCESS = 'f7b_access_token';
const STORAGE_KEY_REFRESH = 'f7b_refresh_token';

class GlobalStore {
    user: User | null = null;
    cart: Cart | null = null;

    constructor() {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        const savedCart = localStorage.getItem(STORAGE_KEY_CART);
        if (savedUser) this.user = JSON.parse(savedUser);
        if (savedCart) this.cart = JSON.parse(savedCart);
    }

    private persist() {
        if (this.user) {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
        } else {
            localStorage.removeItem(STORAGE_KEY_USER);
        }
        if (this.cart) {
            localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(this.cart));
        } else {
            localStorage.removeItem(STORAGE_KEY_CART);
        }
    }

    async loginUser(email: string, password: string): Promise<boolean> {
        try {
            const { data: tokens } = await axiosInstance.post('/api/auth/login', { email, password });
            if (!tokens) return false;
            localStorage.setItem(STORAGE_KEY_ACCESS, tokens.accessToken);
            localStorage.setItem(STORAGE_KEY_REFRESH, tokens.refreshToken);
            const { data: user } = await axiosInstance.get('/api/auth/me');
            this.user = user;
            this.cart = { id: Math.random().toString(), userId: this.user!.id, items: [] };
            this.persist();
            return true;
        } catch {
            return false;
        }
    }

    async registerUser(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
        try {
            await axiosInstance.post('/api/auth/register', { name, email, password });
            const ok = await this.loginUser(email, password);
            return { success: ok };
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 409) return { success: false, error: 'Email уже используется' };
            return { success: false, error: 'Ошибка при регистрации' };
        }
    }

    async logoutUser(): Promise<boolean> {
        this.user = null;
        this.cart = null;
        localStorage.removeItem(STORAGE_KEY_ACCESS);
        localStorage.removeItem(STORAGE_KEY_REFRESH);
        this.persist();
        return true;
    }

    getUser(): User | null {
        return this.user;
    }

    getCart(): Cart | null {
        return this.cart;
    }

    updateCart(items: Cart['items']) {
        if (this.cart) {
            this.cart.items = items;
            this.persist();
        }
    }

    updateUser(partial: Partial<User>) {
        if (this.user) {
            Object.assign(this.user, partial);
            this.persist();
        }
    }
}

const store = new GlobalStore();

export default store;
