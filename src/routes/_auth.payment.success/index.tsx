import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/payment/success/')({
    component: PaymentSuccessPage,
})

function PaymentSuccessPage() {
    return (
        <div className="p-2">
            <h2>Оплата прошла успешно!</h2>
            <Link to="/orders">Перейти к заказами</Link>
        </div>
    )
}
