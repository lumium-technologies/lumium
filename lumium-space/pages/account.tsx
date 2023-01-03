import { Button } from "@chakra-ui/react";
import { Authenticator } from "@components/security/Authenticator";
import { useApi } from "@hooks/api";
import { SECURE_AUTH_SIGNOUT, SECURE_USER_DELETE } from "@routes/api/v1";
import { ROOT } from "@routes/space";
import Router from "next/router";
import { useEffect } from "react";

const AccountPage: React.FC = () => {
    useEffect(() => {
        document.title = "Lumium | Account Settings"
    }, []);
    const [api] = useApi();
    const handleDelete = () => {
        api.delete(SECURE_USER_DELETE).then(() => Router.push(ROOT));
    };
    const handleLogout = () => {
        api.post(SECURE_AUTH_SIGNOUT).then(() => Router.push(ROOT));
    };
    return (
        <Authenticator>
            <Button backgroundColor={"grey"} onClick={handleLogout} data-cy={"signOut"}>
                Logout
            </Button>
            <Button backgroundColor={"darkred"} onClick={handleDelete} data-cy={"deleteAccount"}>
                Delete Account
            </Button>
        </Authenticator>
    );
};

export default AccountPage;
