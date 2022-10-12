import { useLoginStatus } from "@hooks";
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { AUTH_SIGNIN } from "@routes/space";

export const Authenticator: React.FC = (props) => {
    const { children } = props;
    const [loggedIn, setLoggedIn] = useState(false);
    const { asPath } = useRouter()
    useEffect(() => {
        useLoginStatus().then((val) => {
            const redirectionURL = asPath.substr(0, asPath.lastIndexOf("/"))
            if (!val) {
                if (!asPath.includes("workspace")) {
                    Router.push(AUTH_SIGNIN + '?redirectionURL=' + encodeURIComponent(redirectionURL));
                } else {
                    Router.push(AUTH_SIGNIN)
                }
            } else {
                setLoggedIn(true);
            }
        });
    }, []);
    if (loggedIn) return children as React.ReactElement;
    return null;
}
