import Session from 'supertokens-auth-react/recipe/session';

export const useLoginStatus = (): Promise<boolean> => {
    if (typeof window === 'undefined') return Promise.resolve(false);
    return Session.doesSessionExist();
}
