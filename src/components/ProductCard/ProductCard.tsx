import { PriceTag } from '../PriceTag'
import styles from './ProductCard.module.scss'
import { ShoppingCart } from 'lucide-react'

export const ProductCard = () => {
    return (
        <div className={styles.productCard}>
            <div className={styles.imageContainer}>
                <img src="https://placehold.co/600x400.png" alt="Карточка товара" />
            </div>
            <div className={styles.headerContainer}>
                <h3>Название товара</h3>
                <p>Категория</p>
            </div>
            <div className={styles.infoContainer}>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum magnam doloremque rerum atque numquam sapiente repellendus necessitatibus pariatur optio nisi.</p>
            </div>
            <div className={styles.priceContainer}>
                <button className={styles.addToCartBtn} type="button">
                    <ShoppingCart className={styles.icon} size={20} />
                </button>
                <PriceTag isSale actualPrice={600} oldPrice={1000} />
            </div>
        </div>
    )
}