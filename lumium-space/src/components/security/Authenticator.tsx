import { get_space_auth_signin, get_x_lumium_session_header } from "lumium-renderer";
import Router from "next/router";
import { useEffect } from "react";

export const Authenticator = ({ children }: React.PropsWithChildren<{}>) => {
    useEffect(() => {
        if (localStorage.getItem(get_x_lumium_session_header()) == null) {
            Router.push(get_space_auth_signin());
        }
    });

    return (
        <>
            {localStorage.getItem(get_x_lumium_session_header()) != null && children}
        </>
    );
};
