import { AUTH_SIGNIN } from "@routes/space";
import Router from "next/router";
import { useEffect, useState } from "react";
import Session from 'supertokens-auth-react/recipe/session';

export const Authenticator: React.FC = (props) => {
    const [loginStatus, setLoginStatus] = useState(false);
    useEffect(() => {
        Session.doesSessionExist().then((loggedIn) => {
            setLoginStatus(loggedIn)
            if (!loggedIn) {
                Router.push(AUTH_SIGNIN)
            };
        });
    }, []);
    return (
        <>
            {loginStatus && props.children}
        </>
    );
};