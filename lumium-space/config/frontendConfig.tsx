import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'

export const frontendConfig = () => {
    return {
        appInfo,
        recipeList: [
            ThirdPartyEmailPasswordReact.init({
                useShadowDom: false,
                emailVerificationFeature: { mode: process.env.NEXT_PUBLIC_NODE_TEST && "OFF" || "REQUIRED" }
            }),
            SessionReact.init(),
        ],
    }
}
