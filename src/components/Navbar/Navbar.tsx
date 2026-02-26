import { Link } from '@tanstack/react-router'
import styles from './Navbar.module.scss'

import store from '@/utils/store'

export const Navbar = () => {
    const user = store.getUser();
    return (
        <div className={styles.navbar}>
            <Link to="/" className={styles.link}>
                Каталог
            </Link>
            <Link to="/cart" className={styles.link}>
                Корзина
            </Link>
            <Link to="/orders" className={styles.link}>
                Заказы
            </Link>
            {user ? (
                <button onClick={() => store.logoutUser()} className={styles.link}>
                    Выход
                </button>
            ) : (
                <Link to="/login" className={styles.link}>
                    Войти
                </Link>
            )}
        </div>
    )
}
