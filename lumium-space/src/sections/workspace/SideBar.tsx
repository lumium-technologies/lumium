import { BoxProps, Link, Image, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Stack, CloseButton, Menu, MenuButton, Button, MenuList, MenuItem, Divider, Icon, FlexProps } from "@chakra-ui/react";
import CreateWorkspace from "@components/forms/CreateWorkspace";
import { WorkspaceDTO, UserDTO } from "@types";
import Router from "next/router";
import { ReactElement, ReactText } from "react";
import { IconType } from "react-icons";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiChevronDown, FiLock, FiPlus } from "react-icons/fi";

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

interface LinkItemProps {
    name: string;
    icon: ReactElement;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: <FiHome /> },
    { name: 'Trending', icon: <FiTrendingUp /> },
    { name: 'Explore', icon: <FiCompass /> },
    { name: 'Favourites', icon: <FiStar /> },
    { name: 'Settings', icon: <FiSettings /> },
];

interface SidebarProps extends BoxProps {
    onSelfClose: () => void;
    workspace: WorkspaceDTO | undefined;
    userInfo: UserDTO | undefined;
    logo: string;
    disclaimerButtonColor: string;
}

const SideBar = ({ onSelfClose, workspace, userInfo, logo, backgroundColor, disclaimerButtonColor, ...rest }: SidebarProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex
            flexDir={"column"}
            transition="3s ease"
            pos="fixed"
            h="100%"
            width={"100%"}
            {...rest}
            backgroundColor={backgroundColor}
        >
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={800}>
                    <ModalHeader>Create a new workspace</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <CreateWorkspace disclaimerButtonColor={disclaimerButtonColor} />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex h="20" alignItems="center" justifyContent="center">
                <Stack align={'center'} display={'flex'}>
                    <Image src={logo} minWidth={"70%"} maxWidth={"80%"} maxH={20} alt="lumium logo" />
                </Stack>
                <CloseButton display={'flex'} onClick={onSelfClose} />
            </Flex>
            {workspace?.name &&
                <Menu>
                    <MenuButton bg="none" w="100%" as={Button} leftIcon={<FiChevronDown />} overflow={"hidden"} justifyContent={{ base: "center", md: "flex-start" }}>
                        {workspace?.name}
                    </MenuButton>
                    <MenuList>
                        {userInfo?.ownedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.ownedWorkspaces.map((w) => {
                                    return <MenuItem key={w.id} as={Button} icon={<FiLock />} onClick={() => { Router.push("/" + w.id) }}>{w.name}</MenuItem>;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.administratedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.administratedWorkspaces.map((w) => {
                                    return <MenuItem key={w.id} as={Button} icon={<FiLock />} onClick={() => { Router.push("/" + w.id) }}>{w.name}</MenuItem>;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.visitorWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.visitorWorkspaces.map((w) => {
                                    return <MenuItem key={w.id} as={Button} icon={<FiLock />} onClick={() => { Router.push("/" + w.id) }}>{w.name}</MenuItem>;
                                })}
                                <Divider />
                            </>
                        }
                        <MenuItem as={Button} onClick={onOpen} icon={<FiPlus />}>New workspace</MenuItem>
                    </MenuList>
                </Menu>
            }
            <Divider />
            <Button leftIcon={<FiPlus />} as={Button} bg="none" justifyContent={{ base: "center", md: "flex-start" }}>
                New page
            </Button>
            <Divider />
            {LinkItems.map((link) => (
                <Button key={link.name} leftIcon={link.icon} as={Button} bg="none" justifyContent={{ base: "center", md: "flex-start" }}>
                    {link.name}
                </Button>
            ))}
        </Flex>
    );
};
export default SideBar;