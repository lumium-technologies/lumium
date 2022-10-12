import { useLoginStatus } from "@hooks";
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';

export const Authenticator: React.FC = (props) => {
    const { children } = props;
    const [loggedIn, setLoggedIn] = useState(false);
    const { asPath } = useRouter()
    useEffect(() => {
        useLoginStatus().then((val) => {
            const redirectionURL = asPath.substr(0, asPath.lastIndexOf("/"))
            if (!val) {
                if (!asPath.includes("workspace")) {
                    Router.push('/auth/signin?redirectionURL=' + encodeURIComponent(redirectionURL));
                } else {
                    Router.push('/auth/signin')
                }
            } else {
                setLoggedIn(true);
            }
        });
    }, []);
    if (loggedIn) return children as React.ReactElement;
    return null;
}
