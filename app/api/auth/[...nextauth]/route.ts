import NextAuth, { NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return { id: 'admin', email: ADMIN_EMAIL, name: 'Administrator' };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' as SessionStrategy },
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) token.isAdmin = true;
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.isAdmin) session.user.isAdmin = true;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
