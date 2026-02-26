export interface Order {
    id: string;
    userId: string;
    products: string[]; // array of product IDs
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled';
}
