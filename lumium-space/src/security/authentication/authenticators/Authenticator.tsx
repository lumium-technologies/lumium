import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useApi, useLoginStatus } from "@hooks";
import React from 'react';

export const Authenticator: React.FC = (props) => {
    const {
        children,
    } = props;
    const { asPath } = useRouter();
    const [api] = useApi();
    const loggedIn = useLoginStatus();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    useEffect(() => {
        const path = "/auth/signin?redirectionURL=" + encodeURIComponent(asPath.substring(0, asPath.lastIndexOf("/")));
        api.get("/auth/user/email/verify").then((promise) => promise.data).then((value) => {
            if (!value.isVerified && value.status == "OK") {
                Router.push("/auth/verify-email");
                setIsEmailVerified(false);
            } else {
                setIsEmailVerified(true);
            }
        }).catch(() => {
            setIsEmailVerified(false);
        });
        if (!loggedIn && !isEmailVerified) {
            if (!asPath.includes("auth")) {
                Router.push(path);
            }
        } else if ((!loggedIn && asPath.includes("auth")) || (loggedIn && isEmailVerified && asPath.includes("auth"))) {
            Router.push("/page");
        }
    }, [loggedIn, isEmailVerified]);
    if ((loggedIn && isEmailVerified && !asPath.includes("auth")) || (!loggedIn && asPath.includes("auth")) || (loggedIn && !isEmailVerified && asPath.includes("verify-email"))) {
        return children as React.ReactElement;
    } else {
        return null;
    }
}
