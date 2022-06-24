import { IconButton } from "@chakra-ui/react";
import Router from "next/router";
import { FaUser } from "react-icons/fa";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

export function ProfileMenu() {
    async function onLogout() {
        await signOut();
        Router.push("/");
    }
    const LogoutButton = (
        <IconButton
            size="md"
            fontSize="lg"
            aria-label="Log out"
            variant="ghost"
            color="current"
            ml={{ base: "0", md: "3" }}
            onClick={onLogout}
            icon={<FaUser />}
        />
    );
    return LogoutButton;
}
