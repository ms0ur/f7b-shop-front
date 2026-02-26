import { PriceTag } from '../PriceTag'
import styles from './ProductCard.module.scss'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import type { Product } from '@/types/Product.interface'

interface ProductCardProps {
    product: Product;
    cartQuantity?: number;
    onCartChange?: (productId: string, delta: number) => void;
}

export const ProductCard = ({ product, cartQuantity = 0, onCartChange }: ProductCardProps) => {
    return (
        <div className={styles.productCard}>
            <div className={styles.imageContainer}>
                <img src={product.img || "https://placehold.co/600x400.png"} alt={product.name} />
            </div>
            <div className={styles.headerContainer}>
                <h3>{product.name}</h3>
                <p>Категория</p>
            </div>
            <div className={styles.infoContainer}>
                <p>{product.description}</p>
            </div>
            <div className={styles.priceContainer}>
                {cartQuantity > 0 ? (
                    <div className={styles.quantityControls} onClick={(e) => e.preventDefault()}>
                        <button
                            className={styles.qtyBtn}
                            onClick={(e) => { e.preventDefault(); onCartChange?.(product.id, -1) }}
                        >
                            <Minus size={16} />
                        </button>
                        <span className={styles.qtyCount}>{cartQuantity}</span>
                        <button
                            className={styles.qtyBtn}
                            onClick={(e) => { e.preventDefault(); onCartChange?.(product.id, 1) }}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        className={styles.addToCartBtn}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onCartChange?.(product.id, 1);
                        }}
                    >
                        <ShoppingCart className={styles.icon} size={20} />
                    </button>
                )}

                <PriceTag
                    isSale={!!product.previousPrice && product.previousPrice > product.actualPrice}
                    actualPrice={product.actualPrice}
                    oldPrice={product.previousPrice}
                />
            </div>
        </div>
    )
}