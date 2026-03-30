import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$lang}/app/history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$lang/app/history/"!</div>
}
