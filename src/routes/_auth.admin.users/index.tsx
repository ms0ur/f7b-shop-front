import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '@/utils/api'
import type { User } from '@/types/User.interface'
import styles from './index.module.scss'

export const Route = createFileRoute('/_auth/admin/users/')({
  loader: async () => {
    try {
      return await api.getUsers()
    } catch {
      return []
    }
  },
  shouldReload: () => true,
  component: AdminUsers,
})

function AdminUsers() {
  const loaderUsers = Route.useLoaderData()
  const [users, setUsers] = useState<User[]>(loaderUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user' })

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
  }

  const handleSave = async () => {
    if (!editingUser) return
    try {
      await api.updateUser(editingUser.id, formData)
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
      setEditingUser(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить пользователя?')) return
    try {
      await api.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h3>Управление пользователями</h3>
      </div>

      {editingUser && (
        <div className={styles.editModal}>
          <div className={styles.editForm}>
            <h4>Редактирование пользователя</h4>
            <label>
              Имя
              <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </label>
            <label>
              Email
              <input value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
            </label>
            <label>
              Роль
              <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value as 'admin' | 'user' }))}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
              <button className={styles.cancelBtn} onClick={() => setEditingUser(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id.substring(0, 6)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles.actionsCell}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(user)}>Ред.</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>Пользователи не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
