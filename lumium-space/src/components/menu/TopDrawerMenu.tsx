import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import React from 'react';

function TopDrawerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <IconButton aria-label="open menu" icon={<ArrowDownIcon />} onClick={onOpen}>
                Open
            </IconButton>
            <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Pages</DrawerHeader>
                    <DrawerBody>
                        <p>Some page</p>
                        <p>Another page</p>
                        <p>More pages...</p>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export { TopDrawerMenu };
