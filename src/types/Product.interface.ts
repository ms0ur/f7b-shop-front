export interface Product {
    id: string;
    name: string;
    img?: string;
    description: string;
    actualPrice: number;
    previousPrice?: number;
}
