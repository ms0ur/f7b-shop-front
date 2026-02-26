import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PriceTag } from '@/components/PriceTag'
import { ShoppingCart } from 'lucide-react'
import { api } from '@/utils/api'
import store from '@/utils/store'
import styles from './index.module.scss'

export const Route = createFileRoute('/product/$id/')({
    loader: async ({ params }) => {
        try {
            return await api.getProductById(params.id)
        } catch {
            return null // handle not found
        }
    },
    component: ProductPage,
})

function ProductPage() {
    const product = Route.useLoaderData()
    const [, forceUpdate] = useState(0)

    if (!product) {
        return <div className="p-2">Товар не найден</div>
    }

    const cartItem = store.getCart()?.items.find(i => i.productId === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    const handleCartChange = async (delta: number) => {
        const cart = store.getCart()
        if (!store.getUser() || !cart) {
            alert('Сначала войдите в систему!')
            return
        }

        const newItems = [...cart.items]
        const existing = newItems.find(item => item.productId === product.id)

        if (existing) {
            existing.quantity += delta
            if (existing.quantity <= 0) {
                const idx = newItems.indexOf(existing)
                newItems.splice(idx, 1)
            }
        } else if (delta > 0) {
            newItems.push({ productId: product.id, quantity: delta })
        }

        store.updateCart(newItems)
        forceUpdate(prev => prev + 1)
    }

    return (
        <div className={styles.productPage}>
            <div className={styles.imageSection}>
                <img src={product.img || "https://placehold.co/600x400.png"} alt={product.name} />
            </div>
            <div className={styles.infoSection}>
                <h2>{product.name}</h2>
                <p className={styles.category}>Категория</p>
                <div className={styles.description}>
                    <p>{product.description}</p>
                </div>

                <div className={styles.actionContainer}>
                    <PriceTag
                        isSale={!!product.previousPrice && product.previousPrice > product.actualPrice}
                        actualPrice={product.actualPrice}
                        oldPrice={product.previousPrice}
                    />

                    {cartQuantity > 0 ? (
                        <div className={styles.quantityControls} onClick={(e) => e.preventDefault()}>
                            <button
                                className={styles.qtyBtn}
                                onClick={(e) => { e.preventDefault(); handleCartChange(-1) }}
                            >
                                -
                            </button>
                            <span className={styles.qtyCount}>{cartQuantity}</span>
                            <button
                                className={styles.qtyBtn}
                                onClick={(e) => { e.preventDefault(); handleCartChange(1) }}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button className={styles.addToCartBtn} onClick={() => handleCartChange(1)}>
                            <ShoppingCart size={20} />
                            В корзину
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
