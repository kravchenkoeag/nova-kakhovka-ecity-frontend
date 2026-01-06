// apps/admin/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@ecity/auth";

/**
 * NextAuth API route handler для адмін панелі
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
