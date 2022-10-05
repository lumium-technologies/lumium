import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useLoginStatus } from "@hooks";

export default function Auth() {
    const loggedIn = useLoginStatus();
    useEffect(() => {
        if (loggedIn) {
            Router.push("/page");
        } else {
            Router.push("/auth/signin");
        };
    }, [loggedIn]);
    return null;
}
