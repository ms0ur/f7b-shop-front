import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '@/utils/api'
import type { Order } from '@/types/Order.interface'
import styles from '../_auth.admin.users/index.module.scss'

export const Route = createFileRoute('/_auth/admin/orders/')({
  loader: async () => {
    try {
      return await api.getOrders()
    } catch {
      return []
    }
  },
  shouldReload: () => true,
  component: AdminOrders,
})

function AdminOrders() {
  const loaderOrders = Route.useLoaderData()
  const [orders, setOrders] = useState<Order[]>(loaderOrders)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [formStatus, setFormStatus] = useState<Order['status']>('pending')

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setFormStatus(order.status)
  }

  const handleSave = async () => {
    if (!editingOrder) return
    try {
      await api.updateOrder(editingOrder.id, { status: formStatus })
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, status: formStatus } : o))
      setEditingOrder(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заказ?')) return
    try {
      await api.deleteOrder(id)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const getProductsCount = (products: string[] | string) => {
    if (typeof products === 'string') {
      try { return JSON.parse(products).length } catch { return 0 }
    }
    return products.length;
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h3>Управление заказами</h3>
      </div>

      {editingOrder && (
        <div className={styles.editModal}>
          <div className={styles.editForm}>
            <h4>Редактирование заказа #{editingOrder.id.substring(0, 6)}</h4>
            <label>
              Статус
              <select value={formStatus} onChange={e => setFormStatus(e.target.value as Order['status'])}>
                <option value="pending">Ожидает оплаты</option>
                <option value="completed">Завершен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </label>
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
              <button className={styles.cancelBtn} onClick={() => setEditingOrder(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID заказа</th>
              <th>ID Пользователя</th>
              <th>Куплено товаров</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id.substring(0, 6)}</td>
                <td>{order.userId.substring(0, 6)}</td>
                <td>{getProductsCount(order.products)}</td>
                <td>{Math.round(order.totalPrice * 100) / 100} ₽</td>
                <td>
                  <span style={{
                    color: order.status === 'completed' ? '#52c41a' : order.status === 'pending' ? '#faad14' : '#ff4d4f',
                    background: order.status === 'completed' ? '#f6ffed' : order.status === 'pending' ? '#fffbe6' : '#fff2f0',
                    padding: '4px 8px', borderRadius: '4px',
                    border: `1px solid ${order.status === 'completed' ? '#b7eb8f' : order.status === 'pending' ? '#ffe58f' : '#ffccc7'}`
                  }}>
                    {order.status === 'completed' ? 'Завершен' : order.status === 'pending' ? 'Ожидает оплаты' : 'Отменен'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(order)}>Ред.</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(order.id)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>Заказы не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
