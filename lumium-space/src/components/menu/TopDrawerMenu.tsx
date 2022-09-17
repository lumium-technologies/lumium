import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import React from 'react';

function TopDrawerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <IconButton aria-label="open menu" icon={<ArrowDownIcon />} onClick={onOpen} data-cy="page-menu-button">
                Open
            </IconButton>
            <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px' data-cy="page-menu-header">Pages</DrawerHeader>
                    <DrawerBody data-cy="page-menu-body">
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
