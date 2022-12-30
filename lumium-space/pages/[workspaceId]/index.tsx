import React, { ReactNode, useState } from 'react';
import { create_workspace } from 'lumium-renderer';
import { useFormik } from 'formik';
import { Heading, Button, Divider, Modal } from "@chakra-ui/react";
import { useWorkspace, useUserInfo } from "@hooks/api";
import { useRouter } from "next/router";
import Router from "next/router";
import { SPACES } from '@routes/space';
import { UserDTO, WorkspaceDTO } from '@types';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Stack,
    Icon,
    useColorModeValue,
    Link,
    Image,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
    FiPlus,
    FiLock,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { Authenticator } from '@components/security/Authenticator';
import CreateWorkspace from '@components/forms/CreateWorkspace';

interface LinkItemProps {
    name: string;
    icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome },
    { name: 'Trending', icon: FiTrendingUp },
    { name: 'Explore', icon: FiCompass },
    { name: 'Favourites', icon: FiStar },
    { name: 'Settings', icon: FiSettings },
];

function SidebarWithHeader({
    workspace,
    userInfo,
    children,
}: {
    workspace?: WorkspaceDTO;
    userInfo?: UserDTO;
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh">
            <SidebarContent
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
                    <SidebarContent onSelfClose={onClose} workspace={workspace} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onSelfClose: () => void;
    workspace?: WorkspaceDTO;
    userInfo?: UserDTO;
}

const SidebarContent = ({ onSelfClose, workspace, userInfo, ...rest }: SidebarProps) => {
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const workspaceCreateModal = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW={800}>
                <ModalHeader>Create a new workspace</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <CreateWorkspace />
                </ModalBody>
            </ModalContent>
        </Modal>
    );

    return (
        <Flex
            flexDir={"column"}
            transition="3s ease"
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="100%"
            {...rest}>
            {workspaceCreateModal}
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Stack align={'center'}>
                    <Image src={logo} minWidth={"70%"} maxWidth={"80%"} alt="lumium logo" />
                </Stack>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onSelfClose} />
            </Flex>
            {workspace?.name &&
                <Menu>
                    <MenuButton p={"2"} bg="none" w="100%" as={Button} leftIcon={<FiChevronDown />}>
                        {workspace?.name}
                    </MenuButton>
                    <MenuList>
                        {userInfo?.ownedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.ownedWorkspaces.map((w) => {
                                    return <MenuItem key={w.id} as={Button} icon={<FiLock />}>{w.name}</MenuItem>;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.administratedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.administratedWorkspaces.map((w) => {
                                    return <MenuItem key={w.id} as={Button} icon={<FiLock />}>{w.name}</MenuItem>;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.visitorWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.visitorWorkspaces.map((w) => {
                                    return <MenuItem key={w.id} as={Button} icon={<FiLock />}>{w.name}</MenuItem>;
                                })}
                                <Divider />
                            </>
                        }
                        <MenuItem as={Button} onClick={onOpen} icon={<FiPlus />}>New workspace</MenuItem>
                    </MenuList>
                </Menu>
            }
            <Divider mb="2" />
            <NavItem h="1%" w="100%" icon={FiPlus} mb="2" mt="2" as={Button} bg="none">
                New page
            </NavItem>
            <Divider mt="2" mb="2" />
            {LinkItems.map((link) => (
                <NavItem h="1%" w="100%" key={link.name} icon={link.icon} as={Button} bg="none">
                    {link.name}
                </NavItem>
            ))}
        </Flex>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                p="4"
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">Justina Clark</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};


const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId } = router.query;
    const workspace = useWorkspace(workspaceId);
    const { userInfo } = useUserInfo();

    return (
        <Authenticator>
            <SidebarWithHeader workspace={workspace} userInfo={userInfo}>
                {
                    (workspace?.name && userInfo?.nickName) &&
                    <Heading>
                        Welcome to the <em>{workspace?.name}</em> workspace, {userInfo?.nickName}!
                    </Heading>
                }
                {
                    workspace?.pages.map((p) => {
                        return (
                            <Button key={p.id} onClick={() => router.push(p.id)}></Button>
                        );
                    })
                }
            </SidebarWithHeader>
        </Authenticator>
    );
};

export default Workspace;
