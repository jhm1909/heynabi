import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '#/server/auth'
import { UserMenu } from '#/components/auth/user-menu'

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
    const { user } = Route.useRouteContext()

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Hey Nabi 🦋</span>
                </div>
                <UserMenu user={user} />
            </header>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar — will be enhanced in Story-UIFoundation */}
                <aside className="hidden w-56 border-r md:block">
                    <nav className="space-y-1 p-3">
                        <p className="text-sm text-muted-foreground">Session</p>
                    </nav>
                </aside>

                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
