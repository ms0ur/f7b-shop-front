import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/utils/api'
import styles from './index.module.scss'

export const Route = createFileRoute('/_auth/orders/$id/')({
  loader: async ({ params }) => {
    try {
      // Fetch order and all products simultaneously to hydrate the items list
      const [order, allProducts] = await Promise.all([
        api.getOrderById(params.id),
        api.getProducts()
      ])

      const productIds: string[] = typeof order.products === 'string'
        ? JSON.parse(order.products)
        : order.products;

      const detailedProducts = productIds.map(pid =>
        allProducts.find(p => p.id === pid)
      ).filter(Boolean)

      return { order, products: detailedProducts }
    } catch (e) {
      console.error('Failed to load order details:', e)
      return null
    }
  },
  component: OrderPage,
})

function OrderPage() {
  const data = Route.useLoaderData()
  if (!data) return <div className={styles.orderDetailPage}>Заказ не найден</div>

  const { order, products } = data

  return (
    <div className={styles.orderDetailPage}>
      <div className={styles.header}>
        <h2>Заказ #{order.id}</h2>
        <span className={styles.status}>
          {order.status === 'completed' ? 'Завершен' : order.status === 'pending' ? 'Ожидает оплаты' : 'Отменен'}
        </span>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.row}>
          <span>Способ доставки</span>
          <span>Электронно / Самовывоз</span>
        </div>
      </div>

      <div className={styles.itemsList}>
        <h3>Товары</h3>
        {products.map((item, idx) => {
          if (!item) return null;
          return (
            <div key={`${item.id}-${idx}`} className={styles.orderItem}>
              <img src={item.img || "https://placehold.co/60x60.png"} alt={item.name} />
              <div className={styles.itemDetails}>
                <h4>{item.name}</h4>
              </div>
              <span className={styles.itemTotal}>{item.actualPrice} ₽</span>
            </div>
          )
        })}
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.totalRow}>
          <span>Итого к оплате</span>
          <span>{order.totalPrice} ₽</span>
        </div>
      </div>
    </div>
  )
}
