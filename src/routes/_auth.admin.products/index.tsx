import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '@/utils/api'
import type { Product } from '@/types/Product.interface'
import styles from '../_auth.admin.users/index.module.scss'

export const Route = createFileRoute('/_auth/admin/products/')({
  loader: async () => {
    try {
      return await api.getProducts()
    } catch {
      return []
    }
  },
  shouldReload: () => true,
  component: AdminProducts,
})

function AdminProducts() {
  const loaderProducts = Route.useLoaderData()
  const [products, setProducts] = useState<Product[]>(loaderProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', actualPrice: 0, previousPrice: 0, img: '' })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      actualPrice: product.actualPrice,
      previousPrice: product.previousPrice || 0,
      img: product.img || ''
    })
  }

  const handleSave = async () => {
    if (!editingProduct) return
    try {
      await api.updateProduct(editingProduct.id, formData)
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p))
      setEditingProduct(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар?')) return
    try {
      await api.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h3>Управление товарами</h3>
      </div>

      {editingProduct && (
        <div className={styles.editModal}>
          <div className={styles.editForm}>
            <h4>Редактирование товара</h4>
            <label>
              Название
              <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </label>
            <label>
              Описание
              <input value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
            </label>
            <label>
              Цена
              <input type="number" value={formData.actualPrice} onChange={e => setFormData(p => ({ ...p, actualPrice: +e.target.value }))} />
            </label>
            <label>
              Старая цена
              <input type="number" value={formData.previousPrice} onChange={e => setFormData(p => ({ ...p, previousPrice: +e.target.value }))} />
            </label>
            <label>
              Ссылка на изображение
              <input value={formData.img} onChange={e => setFormData(p => ({ ...p, img: e.target.value }))} />
            </label>
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
              <button className={styles.cancelBtn} onClick={() => setEditingProduct(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Фото</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>#{product.id.substring(0, 6)}</td>
                <td>
                  <img src={product.img || "https://placehold.co/40x40.png"} alt={product.name} style={{ borderRadius: '4px', width: '40px', height: '40px', objectFit: 'cover' }} />
                </td>
                <td>{product.name}</td>
                <td>{product.actualPrice} ₽</td>
                <td>
                  <div className={styles.actionsCell}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(product)}>Ред.</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>Товары не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
