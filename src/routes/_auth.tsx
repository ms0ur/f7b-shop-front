import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import store from '@/utils/store'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    if (!store.getUser()) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: () => <Outlet />,
})
