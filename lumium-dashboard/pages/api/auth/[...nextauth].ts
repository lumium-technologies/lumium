import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
    providers: [
        {
            id: "heroku",
            name: "Heroku",
            type: "oauth",
            authorization: {
                url: "https://id.heroku.com/oauth/authorize",
                params: { scope: "write,identity" }
            },
            token: "https://id.heroku.com/oauth/token",
            clientId: process.env.HEROKU_OAUTH_ID,
            clientSecret: process.env.HEROKU_OAUTH_SECRET,
            userinfo: "https://api.heroku.com/account",
            profile(profile) {
                return {
                    id: profile.id,
                    email: profile.email,
                }
            },
        },
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: "wioadjowjd"
    },
    secret: "wioadjowjd"
})