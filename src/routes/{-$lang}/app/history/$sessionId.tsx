import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$lang}/app/history/$sessionId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$lang/app/history/$sessionId"!</div>
}
