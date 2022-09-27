import { Button, Icon, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import Router from "next/router";
import { CgProfile } from "react-icons/cg";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

export function ProfileMenu() {
    const onLogout = () => {
        signOut().then(() => Router.push("/"));
    }

    const onAccount = () => {
        Router.push("/account");
    }
    const LogoutButton = (
        <Menu>
            <MenuButton as={Button} data-cy="profile-button" ml="1%" >
                <Icon as={CgProfile} />
            </MenuButton>
            <MenuList>
                <MenuGroup title='Profile'>
                    <MenuItem onClick={onAccount} data-cy="profile-account-button">My Account</MenuItem>
                    <MenuItem onClick={onLogout} data-cy="profile-logout-button">Logout</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title='Help'>
                    <MenuItem>Docs</MenuItem>
                    <MenuItem>FAQ</MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    );
    return LogoutButton;
}
