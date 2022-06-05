import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import dynamic from 'next/dynamic'

const ThirdPartyEmailPasswordAuthNoSSR = dynamic(
    new Promise((res) =>
        res(ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth)
    ) as any,
    { ssr: false }
)

export { ThirdPartyEmailPasswordAuthNoSSR as Authenticator };
