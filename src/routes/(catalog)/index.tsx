import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchInput } from '@/components/SearchInput'
import { ProductCard } from '@/components/ProductCard'
import { api } from '@/utils/api'
import store from '@/utils/store'
import styles from './index.module.scss'

export const Route = createFileRoute('/(catalog)/')({
    loader: async () => {
        try {
            return await api.getProducts()
        } catch {
            return [] // gracefully handle failure
        }
    },
    component: CatalogPage,
})

function CatalogPage() {
    const products = Route.useLoaderData()
    const [search, setSearch] = useState('')
    const [, forceUpdate] = useState(0)

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleCartChange = async (productId: string, delta: number) => {
        const cart = store.getCart()
        if (!store.getUser() || !cart) {
            alert('Сначала войдите в систему!')
            return
        }

        const newItems = [...cart.items]
        const existing = newItems.find(item => item.productId === productId)

        if (existing) {
            existing.quantity += delta
            if (existing.quantity <= 0) {
                const idx = newItems.indexOf(existing)
                newItems.splice(idx, 1)
            }
        } else if (delta > 0) {
            newItems.push({ productId, quantity: delta })
        }

        store.updateCart(newItems)
        forceUpdate(prev => prev + 1)
    }

    return (
        <div className={styles.catalogPage}>
            <div className={styles.header}>
                <h2>Каталог</h2>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Поиск товаров..."
                />
            </div>

            <div className={styles.productList}>
                {filtered.map(product => {
                    const cartItem = store.getCart()?.items.find(i => i.productId === product.id);
                    const cartQuantity = cartItem ? cartItem.quantity : 0;
                    return (
                        <Link key={product.id} to="/product/$id" params={{ id: product.id }} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ProductCard
                                product={product}
                                cartQuantity={cartQuantity}
                                onCartChange={handleCartChange}
                            />
                        </Link>
                    )
                })}
            </div>

            {filtered.length === 0 && <p>Ничего не найдено</p>}
        </div>
    )
}
