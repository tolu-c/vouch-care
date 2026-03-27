import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getSession } from "@/server/auth";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      const result = await getSession();
      const user = result?.success ? result.data : null;
      return { user, isAuthenticated: !!user };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  },
  errorComponent: ({ error }) => (
    <p className="p-4 text-red-600">
      {error instanceof Error ? error.message : "Something went wrong."}
    </p>
  ),
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "VouchCare — Get the Right Care Instantly",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  notFoundComponent: () => <p>Page not found.</p>,
  shellComponent: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(27,40,128,0.18)]">
        <Outlet />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
