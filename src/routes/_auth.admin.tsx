import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import styles from '@/components/Navbar/Navbar.module.scss'

export const Route = createFileRoute('/_auth/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="p-2">
      <h2>Админ панель</h2>
      <div className={styles.navbar}>
        <Link to="/admin/users" className={styles.link}>Пользователи</Link>
        <Link to="/admin/products" className={styles.link}>Товары</Link>
        <Link to="/admin/orders" className={styles.link}>Заказы</Link>
      </div>
      <hr />
      <Outlet />
    </div>
  )
}
