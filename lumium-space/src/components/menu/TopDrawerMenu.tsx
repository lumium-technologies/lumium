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
import { ArrowRightIcon } from '@chakra-ui/icons';
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { SwitchColorTheme } from "@components/headers"
import Router from "next/router";

async function onLogout() {
    await signOut();
    window.location.href = "/";
}

async function onAccount() {
    Router.push("/account");
}

function TopDrawerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex m={["1%"]}>
                <IconButton onClick={onOpen} aria-label={''} icon={<ArrowRightIcon />} >
                    Open
                </IconButton>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                >
                    <DrawerOverlay />
                    <DrawerContent maxW={"12%"}>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Pages
                        </DrawerHeader>

                        <DrawerBody>
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
                                    <Image src="logo/parts/fg/icon.svg" alt="Logo" boxSize="40px" />
                                </Box>
                            </Flex>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Spacer />

                <SwitchColorTheme />

                <Menu>
                    <MenuButton as={Button} >
                        <Icon as={CgProfile} />
                    </MenuButton>
                    <MenuList>
                        <MenuGroup title='Profile'>
                            <MenuItem onClick={onAccount}>My Account</MenuItem>
                            <MenuItem onClick={onLogout}>Logout</MenuItem>
                        </MenuGroup>
                        <MenuDivider />
                        <MenuGroup title='Help'>
                            <MenuItem>Docs</MenuItem>
                            <MenuItem>FAQ</MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>
            </Flex>
        </>
    )
}

export { TopDrawerMenu };
