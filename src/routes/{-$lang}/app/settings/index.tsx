import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$lang}/app/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$lang/app/settings/"!</div>
}
