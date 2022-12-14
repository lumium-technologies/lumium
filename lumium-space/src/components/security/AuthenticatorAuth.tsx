import { useUserInfo } from "@hooks/api";
import { SPACES_NEW } from "@routes/space";
import Router from "next/router";
import { useEffect, useState } from "react";
import Session from 'supertokens-auth-react/recipe/session';

export const AuthenticatorAuth: React.FC = (props) => {
    const [loginStatus, setLoginStatus] = useState(false);
    const userInfo = useUserInfo();
    useEffect(() => {
        Session.doesSessionExist().then((loggedIn) => {
            if (loggedIn) {
                if (userInfo?.recentWorkspace) {
                    Router.push('/' + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                };
            } else {
                setLoginStatus(true);
            };
        });
    }, [userInfo?.recentWorkspace]);
    return (
        <>
            {loginStatus && props.children}
        </>
    );
};