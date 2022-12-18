import { useApi } from "@hooks/api";
import { AUTH_SIGNIN, AUTH_VERIFY_EMAIL, EMAIL_VERIFY } from "@routes/space";
import Router from "next/router";
import { useEffect, useState } from "react";
import Session from 'supertokens-auth-react/recipe/session';

export const Authenticator: React.FC = (props) => {
    const [api] = useApi();
    const [loginStatus, setLoginStatus] = useState(false);
    useEffect(() => {
        Session.doesSessionExist().then((loggedIn) => {
            setLoginStatus(loggedIn)
            if (!loggedIn) {
                Router.push(AUTH_SIGNIN)
            } else {
                api.get(EMAIL_VERIFY).then((promise) => promise.data).then((value) => {
                    if (!value.isVerified) {
                        Router.push(AUTH_VERIFY_EMAIL);
                    };
                });
            };
        });
    }, [Session]);
    return (
        <>
            {loginStatus && props.children}
        </>
    );
};