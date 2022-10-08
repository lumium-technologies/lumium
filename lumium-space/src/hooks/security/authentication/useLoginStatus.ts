import { useState } from 'react';
import Session from 'supertokens-auth-react/recipe/session';

export const useLoginStatus = (): boolean => {
    const [loggedIn, setLoggedIn] = useState(true);
    if (typeof window === 'undefined') return false;
    const waitForSession = async () => {
        setLoggedIn(await Session.doesSessionExist());
    }
    waitForSession();
    return loggedIn;
}
