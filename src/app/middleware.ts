// middleware.ts (place this at the root of your project)
export { default } from "next-auth/middleware";

export const config = {
  // Protect all dashboard routes
  matcher: ["/dashboard/:path*"],
};
