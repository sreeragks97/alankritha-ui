import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/src/lib/supabase-middleware";

const protectedPrefixes = [
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/banners",
  "/admin/leads",
];

function isProtectedPath(pathname: string): boolean {
  if (pathname === "/admin/login") {
    return false;
  }

  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/whatsapp-leads" || pathname.startsWith("/admin/whatsapp-leads/")) {
    const redirectUrl = new URL(pathname.replace("/admin/whatsapp-leads", "/admin/leads"), request.url);
    redirectUrl.search = request.nextUrl.search;

    return NextResponse.redirect(redirectUrl);
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const { supabase, response, user } = await updateSupabaseSession(request);

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = (profile as { role?: string } | null)?.role;

  if (error || !role || (role !== "admin" && role !== "super_admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
