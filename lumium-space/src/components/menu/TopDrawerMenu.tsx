import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Input,
    IconButton,
    Flex,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { ArrowRightIcon } from '@chakra-ui/icons';
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import React from 'react';

async function onLogout() {
    await signOut();
    window.location.href = "/";
}

function TopDrawerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex>
                <IconButton onClick={onOpen} aria-label={''} icon={<ArrowRightIcon />} >
                    Open
                </IconButton>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Pages</DrawerHeader>

                        <DrawerBody>
                            Some pages
                            <Button display="flex" position="absolute" bottom="2%">
                                + Add new page
                            </Button>
                        </DrawerBody>

                        <DrawerFooter>

                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <NumberInput defaultValue={11} min={1} max={99} width="4%">
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>

                <Spacer />

                <Menu>
                    <MenuButton as={Button} backgroundColor={'darkgrey'}>
                    </MenuButton>
                    <MenuList>
                        <MenuGroup title='Profile'>
                            <MenuItem>My Account</MenuItem>
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
