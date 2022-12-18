import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import EmailVerification from 'supertokens-auth-react/recipe/emailverification';
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'

export const frontendConfig = () => {
    return {
        appInfo,
        recipeList: [
            EmailVerification.init({
                mode: process.env.NEXT_PUBLIC_NODE_TEST && "OPTIONAL" || "REQUIRED"
            }),
            ThirdPartyEmailPasswordReact.init({
                useShadowDom: false,
            }),
            SessionReact.init(),
        ],
    }
}
