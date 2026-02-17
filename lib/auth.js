import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabaseAdmin } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        if (!user.email) {
          return false;
        }

        const { error } = await supabaseAdmin.from("users").upsert(
          {
            email: user.email,
            name: user.name,
            image: user.image,
            email_verified: new Date().toISOString(),
          },
          {
            onConflict: "email",
          },
        );

        if (error) {
          console.error("Supabase signIn upsert error:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user) {
        if (!session.user.email) {
          return session;
        }

        const { data: dbUser, error } = await supabaseAdmin
          .from("users")
          .upsert(
            {
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              email_verified: new Date().toISOString(),
            },
            { onConflict: "email" },
          )
          .select("id")
          .single();

        if (!error && dbUser?.id) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
