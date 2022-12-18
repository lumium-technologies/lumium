import { useApi } from "@hooks/api";
import { SECURE_PONG } from "@routes/api/v1";
import { AUTH_SIGNIN } from "@routes/space";
import Router from "next/router";
import { useEffect, useState } from "react";

export const Authenticator: React.FC = (props) => {
    const [loginStatus, setLoginStatus] = useState(false);
    const [api] = useApi();

    useEffect(() => {
        api.get(SECURE_PONG).then((res) => {
            if (res.status == 200) {
                setLoginStatus(true);
            } else if (res.status == 401) {
                setLoginStatus(false);
                Router.push(AUTH_SIGNIN);
            }
        });
    }, [api]);

    return (
        <>
            {loginStatus && props.children}
        </>
    );
};
