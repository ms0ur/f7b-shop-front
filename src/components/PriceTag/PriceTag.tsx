import clsx from 'clsx';
import styles from './PriceTag.module.scss'

interface PriceTagProps {
    isSale: boolean;
    actualPrice: number;
    oldPrice?: number;
}

export const PriceTag = ({ isSale, actualPrice, oldPrice }: PriceTagProps) => {
    return (
        <div className={clsx(styles.priceTag, isSale && styles.priceTagSale)}>
            <span className={styles.actualPrice}>
                {Math.round(actualPrice * 100) / 100} ₽
            </span>

            {isSale && oldPrice && (
                <span className={styles.oldPrice}>
                    {Math.round(oldPrice * 100) / 100} ₽
                </span>
            )}
        </div>
    )
}