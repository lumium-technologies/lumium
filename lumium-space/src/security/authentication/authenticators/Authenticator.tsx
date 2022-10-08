import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useLoginStatus } from "@hooks";
import React from 'react';

export const Authenticator: React.FC = (props) => {
    const {
        children,
    } = props;
    const { asPath } = useRouter();
    const loggedIn = useLoginStatus();
    useEffect(() => {
        const path = "/auth/signin?redirectionURL=" + encodeURIComponent(asPath.substring(0, asPath.lastIndexOf("/")));
        if (!loggedIn) {
            if (asPath.includes("auth")) {
                Router.push("/auth/signin")
            }
            Router.push(path);
        }
    }, [loggedIn]);
    if (loggedIn) {
        return children as React.ReactElement;
    } else {
        return null;
    }
}
