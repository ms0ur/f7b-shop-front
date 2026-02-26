import type { User } from "@/types/User.interface";
import type { Cart } from "@/types/Cart.interface";
import axiosInstance from "./axiosInstance";

const STORAGE_KEY_USER = 'f7b_user';
const STORAGE_KEY_CART = 'f7b_cart';

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

    async loginUser(login: string, password: string): Promise<boolean> {
        return await axiosInstance.post('/users/login', { email: login, password })
            .then(response => {
                if (response.data == null) {
                    throw new Error("Login response is null");
                }
                this.user = response.data;
                this.cart = { id: Math.random().toString(), userId: this.user!.id, items: [] };
                this.persist();
                return true;
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    async logoutUser(): Promise<boolean> {
        this.user = null;
        this.cart = null;
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