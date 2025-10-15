import NextAuth from 'next-auth';
import { authOptions } from '@ecity/auth';

// NextAuth API route handler

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
