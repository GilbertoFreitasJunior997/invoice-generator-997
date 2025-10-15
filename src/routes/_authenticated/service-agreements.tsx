import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/service-agreements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/service-agreements"!</div>
}
