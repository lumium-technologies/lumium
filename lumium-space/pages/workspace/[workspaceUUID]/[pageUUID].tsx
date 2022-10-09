import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    IconButton,
    Flex,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    Button,
    Image,
    Icon,
    Box
} from '@chakra-ui/react'
import { ArrowRightIcon, UpDownIcon } from '@chakra-ui/icons';
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { FiSettings } from "react-icons/fi";
import { SwitchColorTheme } from "@components/headers"
import Router from "next/router";
import { Authenticator } from "@security";
import { LumiumRenderer } from "@components";

const Page: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const onLogout = () => {
        signOut().then(() => Router.push("/"));
    };
    const onAccount = () => {
        Router.push("/account");
    };
    const onSpaces = () => {
        Router.push("/spaces");
    };
    return (
        <Authenticator>
            <Flex p={["1%"]} borderBottom="1px">
                <IconButton onClick={onOpen} aria-label={''} icon={<ArrowRightIcon />} data-cy="page-menu-button">
                    Open
                </IconButton>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                >
                    <DrawerOverlay />
                    <DrawerContent maxW={"15%"}>
                        <DrawerCloseButton data-cy="page-menu-close" />
                        <DrawerHeader data-cy="page-menu-header">
                            Pages
                        </DrawerHeader>

                        <DrawerBody data-cy="page-menu-body">
                            Some pages
                        </DrawerBody>

                        <DrawerFooter height="10%" >
                            <Flex width={"100%"}>
                                <Box>
                                    <Button>
                                        + Add new page
                                    </Button>
                                </Box>
                                <Spacer />
                                <Box>
                                    <Image src="logo/parts/fg/icon.svg" alt="Logo" boxSize="40px" data-cy="page-menu-logo" />
                                </Box>
                            </Flex>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <Menu>
                    <MenuButton
                        ml="1%"
                        as={Button}
                        width={"12%"}
                        rightIcon={<UpDownIcon />}
                    >
                        Spaces
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Some</MenuItem>
                        <MenuItem>Spaces</MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FiSettings />} onClick={onSpaces}>Manage Spaces</MenuItem>
                    </MenuList>
                </Menu>
                <Spacer />

                <SwitchColorTheme />

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
            </Flex>
            <Box p={["1%"]}>
                <LumiumRenderer />
            </Box>
        </Authenticator>
    );
};

export default Page;
