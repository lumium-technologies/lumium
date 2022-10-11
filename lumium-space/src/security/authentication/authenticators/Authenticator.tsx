import { useLoginStatus } from "@hooks";
import React, { useState, useEffect } from 'react';
import Router from 'next/router';

export const Authenticator: React.FC = (props) => {
    const { children } = props;
    const loggedIn = useState(false);
    useEffect(() => {
        useLoginStatus().then((val) => {
            if (!val) {
                Router.push('/auth/signin');
            }
        });
    }, []);
    if (loggedIn) return children as React.ReactElement;
    return null;
}
