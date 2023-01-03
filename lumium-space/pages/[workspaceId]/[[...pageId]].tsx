import React from 'react';
import { Heading, Button, Divider, Modal } from "@chakra-ui/react";
import { useWorkspace, useUserInfo } from "@hooks/api";
import { useRouter } from "next/router";
import {
    Box,
    Textarea,
    Flex,
    Drawer,
    DrawerContent,
    useDisclosure,
} from '@chakra-ui/react';
import { Authenticator } from '@components/security/Authenticator';
import { LumiumRenderer } from '@components/rendering';
import SideBar from '@sections/workspace/SideBar';
import MobileNav from '@sections/workspace/NavBar';

const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId, pageId } = router.query;
    const workspace = useWorkspace(workspaceId);
    const { userInfo } = useUserInfo();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Authenticator>
            <Box minH="100vh">
                <SideBar
                    onSelfClose={() => onClose}
                    display={{ base: 'none', md: 'block' }}
                    workspace={workspace}
                    userInfo={userInfo}
                />
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full">
                    <DrawerContent>
                        <SideBar onSelfClose={onClose} workspace={workspace} />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav onOpen={onOpen} userInfo={userInfo} workspace={workspace} />
                <Box ml={{ base: 0, md: 60 }} p="4">
                    {
                        (workspace?.name && userInfo?.nickName && !pageId) &&
                        <Heading>
                            Welcome to the <em>{workspace?.name}</em> workspace, {userInfo?.nickName}!
                        </Heading>
                    }
                    {
                        pageId &&
                        <Flex flexDir="row">
                            <Textarea />
                            <LumiumRenderer />
                        </Flex>
                    }
                    {
                        workspace?.pages.map((p) => {
                            return (
                                <Button key={p.id} onClick={() => router.push(p.id)}></Button>
                            );
                        })
                    }
                </Box>
            </Box>
        </Authenticator>
    );
};

export default Workspace;
