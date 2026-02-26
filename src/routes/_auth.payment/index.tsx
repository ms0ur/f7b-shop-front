import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { api } from '@/utils/api'
import store from '@/utils/store'
import type { Product } from '@/types/Product.interface'

export const Route = createFileRoute('/_auth/payment/')({
  component: PaymentPage,
})

function PaymentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<{ product: Product, quantity: number }[]>([])

  useEffect(() => {
    const fetchCart = async () => {
      const cart = store.getCart()
      if (!cart || cart.items.length === 0) {
        navigate({ to: '/cart' })
        return
      }
      try {
        const products = await api.getProducts()
        const populated = cart.items.map(item => {
          return {
            product: products.find(p => p.id === item.productId)!,
            quantity: item.quantity
          }
        }).filter(item => item.product !== undefined)
        setCartItems(populated)
      } catch (e) {
        console.error(e)
      }
    }
    fetchCart()
  }, [navigate])

  const handlePayment = async () => {
    setLoading(true)
    try {
      const user = store.getUser()
      if (!user) return

      const totalActual = Math.round(cartItems.reduce((sum, item) => sum + item.product.actualPrice * item.quantity, 0) * 100) / 100

      // Flatten the product IDs array to match our previous order format
      // assuming the backend expects string[] of IDs.
      const expandedProductIds: string[] = []
      cartItems.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          expandedProductIds.push(item.product.id)
        }
      })

      // 1. Create order
      const newOrder = await api.createOrder({
        userId: user.id,
        products: expandedProductIds,
        totalPrice: totalActual,
        status: 'completed'
      })

      // 2. Clear cart and add order to user
      const newOrdersList = [...(user.orders || []), newOrder.id]
      await api.updateUser(user.id, { orders: newOrdersList })

      // 3. Update local store cache
      store.updateCart([])
      store.updateUser({ orders: newOrdersList })

      navigate({ to: '/payment/success' })
    } catch (error) {
      console.error('Ошибка при оплате', error)
      alert('Произошла ошибка при оплате')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.paymentPage}>
      <div className={styles.card}>
        <h2>Оплата заказа</h2>
        <div className={styles.info}>
          <p>К оплате: {Math.round(cartItems.reduce((sum, item) => sum + item.product.actualPrice * item.quantity, 0) * 100) / 100} ₽</p>
          <p>Товаров: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
        </div>
        <button
          className={styles.payBtn}
          onClick={handlePayment}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? 'Обработка...' : 'Оплатить'}
        </button>
      </div>
    </div>
  )
}
