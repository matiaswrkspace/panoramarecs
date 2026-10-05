import { NextResponse, type NextRequest } from "next/server";
import { comingSoon } from "@/site.config";

// Finché il sito è in "coming soon" ogni pagina mostra /soon (l'indirizzo resta quello).
// Anteprima per chi lavora al sito: aprire /?preview=<PREVIEW_KEY> una volta salva
// un cookie per 30 giorni e da quel browser si vede il sito vero.
export function proxy(request: NextRequest) {
  if (!comingSoon) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;
  const key = process.env.PREVIEW_KEY;

  if (key && searchParams.get("preview") === key) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const response = NextResponse.redirect(url);
    response.cookies.set("preview", key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }
  if (key && request.cookies.get("preview")?.value === key) return NextResponse.next();
  if (pathname === "/soon") return NextResponse.next();

  return NextResponse.rewrite(new URL("/soon", request.url));
}

export const config = {
  // Tutto tranne i file di Next e i file statici (immagini, font, favicon…).
  matcher: ["/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};
