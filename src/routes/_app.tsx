import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad({ context }) {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/_auth/login" });
    }
  },
  component: Outlet,
});
