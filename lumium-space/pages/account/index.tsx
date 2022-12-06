import { Button } from "@chakra-ui/react";
import { Authenticator } from "@components/security/Authenticator";
import { useApi } from "@hooks/api";
import { SECURE_USER_DELETE } from "@routes/api/v1";
import { ROOT } from "@routes/space";
import Router from "next/router";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

const AccountPage: React.FC = () => {
    const [api] = useApi();
    const handleDelete = () => {
        api.delete(SECURE_USER_DELETE).then(() => Router.push(ROOT));
    };
    const handleLogout = () => {
        signOut().then(() => Router.push(ROOT));
    };
    return (
        <Authenticator>
            <Button backgroundColor={"grey"} onClick={handleLogout}>
                Logout
            </Button>
            <Button backgroundColor={"darkred"} onClick={handleDelete}>
                Delete Account
            </Button>
        </Authenticator>
    );
};

export default AccountPage;