import { useState } from 'react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '#/server/auth'
import { AppHeader } from '#/components/layout/app-header'
import { AppSidebar } from '#/components/layout/app-sidebar'
import { MobileNav } from '#/components/layout/mobile-nav'

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
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="relative flex h-screen flex-col">
            <AppHeader
                user={user}
                onMenuToggle={() => setMobileNavOpen(true)}
                onSidebarToggle={() => setSidebarOpen((p) => !p)}
                sidebarOpen={sidebarOpen}
            />

            <div className="flex flex-1 overflow-hidden">
                <AppSidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>

            <MobileNav
                open={mobileNavOpen}
                onOpenChange={setMobileNavOpen}
            />
        </div>
    )
}
