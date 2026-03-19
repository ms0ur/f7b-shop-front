import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import styles from './Navbar.module.scss'
import store from '@/utils/store'

export const Navbar = () => {
    useRouterState() // re-render navbar on every navigation so store values stay fresh
    const user = store.getUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await store.logoutUser();
        navigate({ to: '/login' });
    };

    return (
        <div className={styles.navbar}>
            <Link to="/" className={styles.link}>
                Каталог
            </Link>
            {user && (
                <>
                    <Link to="/cart" className={styles.link}>
                        Корзина
                    </Link>
                    <Link to="/orders" className={styles.link}>
                        Заказы
                    </Link>
                </>
            )}
            {user?.role === 'admin' && (
                <Link to="/admin" className={styles.link}>
                    Админ
                </Link>
            )}
            {user ? (
                <button onClick={handleLogout} className={styles.link}>
                    Выход
                </button>
            ) : (
                <>
                    <Link to="/login" className={styles.link}>
                        Войти
                    </Link>
                    <Link to="/register" className={styles.link}>
                        Регистрация
                    </Link>
                </>
            )}
        </div>
    )
}
