import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import store from '@/utils/store'
import styles from './index.module.scss'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await store.loginUser(login, password)
      if (success) {
        navigate({ to: '/' })
      } else {
        setError('Неверный логин или пароль')
      }
    } catch {
      setError('Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Войдите в свой аккаунт, чтобы продолжить покупки</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login">Логин</label>
            <input
              id="login"
              type="text"
              className={styles.input}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите ваш логин"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
