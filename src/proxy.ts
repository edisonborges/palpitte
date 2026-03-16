import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const platformRoutes = [
  "/dashboard",
  "/jogos",
  "/ranking",
  "/boloes",
  "/premios",
  "/perfil",
];

const resellerRoutes = ["/reseller/dashboard", "/reseller/personalizacao", "/reseller/usuarios", "/reseller/boloes", "/reseller/relatorios", "/reseller/configuracoes"];

export default auth(
  (req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
    const { pathname } = req.nextUrl;

    const isPlatformRoute = platformRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isResellerRoute = resellerRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isResellerApi = pathname.startsWith("/api/reseller");

    const session = req.auth;
    const userRole = session?.user?.role;

    if (isPlatformRoute || isResellerRoute || isResellerApi) {
      if (!session) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (
        (isResellerRoute || isResellerApi) &&
        userRole !== "RESELLER" &&
        userRole !== "ADMIN"
      ) {
        if (isResellerApi) {
          return NextResponse.json(
            { success: false, error: "Não autorizado" },
            { status: 401 }
          );
        }
        return NextResponse.redirect(
          new URL("/dashboard", req.nextUrl.origin)
        );
      }
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/jogos/:path*",
    "/ranking/:path*",
    "/boloes/:path*",
    "/premios/:path*",
    "/perfil/:path*",
    "/reseller/:path*",
    "/api/reseller/:path*",
  ],
};
