import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { PriceTag } from '@/components/PriceTag'
import { api } from '@/utils/api'
import store from '@/utils/store'
import type { CartItem } from '@/types/Cart.interface'
import type { Product } from '@/types/Product.interface'

export const Route = createFileRoute('/_auth/cart/')({
    loader: async () => {
        const cart = store.getCart()
        if (!cart || !cart.items.length) return { products: [] as Product[], items: [] as CartItem[] }

        try {
            const allProducts = await api.getProducts()
            const productIds = cart.items.map(i => i.productId)
            return {
                products: allProducts.filter(p => productIds.includes(p.id)),
                items: [...cart.items]
            }
        } catch {
            return { products: [] as Product[], items: [] as CartItem[] }
        }
    },
    shouldReload: () => true,
    component: CartPage,
})

function CartPage() {
    const loaderData = Route.useLoaderData()
    const [products, setProducts] = useState<Product[]>(loaderData.products)
    const [cartItems, setCartItems] = useState<CartItem[]>(loaderData.items)
    const navigate = useNavigate()

    useEffect(() => {
        setProducts(loaderData.products)
        setCartItems(loaderData.items)
    }, [loaderData])

    const handleQuantityChange = (productId: string, delta: number) => {
        if (!store.getUser()) return

        let newItems = cartItems.map(i => ({ ...i }))
        const existing = newItems.find(i => i.productId === productId)

        if (existing) {
            existing.quantity += delta
            if (existing.quantity <= 0) {
                newItems = newItems.filter(i => i.productId !== productId)
                setProducts(prev => prev.filter(p => p.id !== productId))
            }
        }

        store.updateCart(newItems)
        setCartItems(newItems)
    }

    const handleRemove = (productId: string) => {
        if (!store.getUser()) return

        const newItems = cartItems.filter(i => i.productId !== productId)
        store.updateCart(newItems)
        setCartItems(newItems)
        setProducts(prev => prev.filter(p => p.id !== productId))
    }

    let totalActual = 0
    let totalPrevious = 0

    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.productId)
        if (product) {
            totalActual += product.actualPrice * item.quantity
            totalPrevious += (product.previousPrice || product.actualPrice) * item.quantity
        }
    })

    totalActual = Math.round(totalActual * 100) / 100
    totalPrevious = Math.round(totalPrevious * 100) / 100
    const totalDiscount = Math.round((totalPrevious - totalActual) * 100) / 100

    return (
        <div className={styles.cartPage}>
            <h2>Корзина</h2>
            {products.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <div className={styles.cartContainer}>
                    <div className={styles.itemsList}>
                        {products.map((item) => {
                            const cartInfo = cartItems.find(i => i.productId === item.id)
                            const quantity = cartInfo ? cartInfo.quantity : 0;
                            const itemTotal = Math.round(item.actualPrice * quantity * 100) / 100;
                            const itemOldTotal = item.previousPrice ? Math.round(item.previousPrice * quantity * 100) / 100 : undefined;
                            return (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.imageBox}>
                                        <img src={item.img || "https://placehold.co/100x100.png"} alt={item.name} />
                                    </div>
                                    <div className={styles.details}>
                                        <h4>{item.name}</h4>
                                        <p>Категория</p>
                                    </div>
                                    <div className={styles.quantityControls} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button onClick={() => handleQuantityChange(item.id, -1)} style={{ padding: '4px 8px' }}>-</button>
                                        <span style={{ fontWeight: 600 }}>{quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)} style={{ padding: '4px 8px' }}>+</button>
                                    </div>
                                    <div className={styles.priceAction}>
                                        <PriceTag
                                            isSale={!!item.previousPrice && item.previousPrice > item.actualPrice}
                                            actualPrice={itemTotal}
                                            oldPrice={itemOldTotal}
                                        />
                                        <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>Удалить</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.summaryBox}>
                        <h3>Итого</h3>
                        <div className={styles.summaryRow}>
                            <span>Товары</span>
                            <span>{totalPrevious} ₽</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Скидка</span>
                            <span>-{totalDiscount} ₽</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>К оплате</span>
                            <span>{totalActual} ₽</span>
                        </div>
                        <button
                            className={styles.checkoutBtn}
                            onClick={() => navigate({ to: '/payment' })}
                        >
                            Перейти к оплате
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
