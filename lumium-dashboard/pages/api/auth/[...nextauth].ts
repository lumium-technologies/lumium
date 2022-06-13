import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
    providers: [
        {
            id: "heroku",
            name: "Heroku",
            type: "oauth",
            authorization: "https://id.heroku.com/oauth/authorize",
            token: "https://id.heroku.com/oauth/token",
            clientId: process.env.HEROKU_OAUTH_ID,
        }
    ],
    secret: process.env.HEROKU_OAUTH_SECRET,

    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.HEROKU_OAUTH_SECRET,
    },
    pages: {
        // signIn: '/auth/signin',  // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) { return true },
        // async redirect({ url, baseUrl }) { return baseUrl },
        // async session({ session, token, user }) { return session },
        // async jwt({ token, user, account, profile, isNewUser }) { return token }
    },

    events: {},

    debug: false,
})