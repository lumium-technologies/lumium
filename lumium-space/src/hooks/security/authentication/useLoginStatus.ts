import Session from 'supertokens-auth-react/recipe/session';

export const useLoginStatus = (): Promise<boolean> => {
    return Session.doesSessionExist();
}
