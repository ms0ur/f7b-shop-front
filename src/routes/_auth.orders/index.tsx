import { createFileRoute, Link } from '@tanstack/react-router'
import styles from './index.module.scss'
import { api } from '@/utils/api'
import store from '@/utils/store'

export const Route = createFileRoute('/_auth/orders/')({
  loader: async () => {
    const user = store.getUser()
    if (!user) return []
    try {
      const allOrders = await api.getOrders()
      // Backend schema says 'orders' array is on User, 
      // and we can filter all Orders by matching IDs or userId
      return allOrders.filter(o => user.orders?.includes(o.id) || o.userId === user.id)
    } catch {
      return []
    }
  },
  component: OrdersPage,
})

function OrdersPage() {
  const orders = Route.useLoaderData()

  return (
    <div className={styles.ordersPage}>
      <h2>Мои заказы</h2>
      {orders.length === 0 ? (
        <p>У вас еще нет заказов.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.header}>
                <h3>Заказ #{order.id}</h3>
                <span className={styles.status}>
                  {order.status === 'completed' ? 'Завершен' : order.status === 'pending' ? 'Ожидает оплаты' : 'Отменен'}
                </span>
              </div>
              <div className={styles.details}>
                <span>Товаров: {(typeof order.products === 'string' ? JSON.parse(order.products) : order.products).length}</span>
                <span>Сумма: {order.totalPrice} ₽</span>
              </div>
              <Link to="/orders/$id" params={{ id: order.id }} className={styles.viewLink}>
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
