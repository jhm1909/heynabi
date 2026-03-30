import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '#/server/auth'

export const Route = createFileRoute('/{-$lang}/app')({
    beforeLoad: async () => {
        const user = await getUser()

        if (!user) {
            throw redirect({ to: '/{-$lang}' })
        }

        return { user }
    },
    component: AppLayout,
})

function AppLayout() {
    return (
        <div className="flex h-screen">
            {/* Sidebar — will be built in Story-UIFoundation */}
            <aside className="hidden w-64 border-r md:block">
                <div className="p-4 font-semibold">Hey Nabi</div>
            </aside>

            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}
