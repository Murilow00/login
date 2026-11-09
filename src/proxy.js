import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ACESSO } from "./lib/acesso";

export default clerkMiddleware(async (auth, req) => {
  const rota = req.nextUrl.pathname.split("/")[1];

  if (!Object.hasOwn(ACESSO, rota)) {
    return;
  }

  const { userId } = await auth();
  const client = await clerkClient();
  const user = userId ? await client.users.getUser(userId) : null;

  if (!ACESSO[rota].includes(user?.publicMetadata?.role)) {
    return NextResponse.redirect(new URL("/", req.url), { status: 302 });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
