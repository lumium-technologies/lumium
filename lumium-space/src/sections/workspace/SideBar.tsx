import { BoxProps, Link, Image, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Stack, CloseButton, Menu, MenuButton, Button, MenuList, MenuItem, Divider, Icon, FlexProps } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";
import CreateWorkspace from "@components/forms/CreateWorkspace";
import { WorkspaceDTO, UserDTO } from "@types";
import { ReactText } from "react";
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
    icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome },
    { name: 'Trending', icon: FiTrendingUp },
    { name: 'Explore', icon: FiCompass },
    { name: 'Favourites', icon: FiStar },
    { name: 'Settings', icon: FiSettings },
];

interface SidebarProps extends BoxProps {
    onSelfClose: () => void;
    workspace?: WorkspaceDTO;
    userInfo?: UserDTO;
}

const SideBar = ({ onSelfClose, workspace, userInfo, ...rest }: SidebarProps) => {
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
            <Flex h="20" alignItems="center" justifyContent="center">
                <Stack align={'center'} display={'flex'}>
                    <Image src={logo} minWidth={"70%"} maxWidth={"80%"} maxH={20} alt="lumium logo" />
                </Stack>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onSelfClose} />
            </Flex>
            {workspace?.name &&
                <Menu>
                    <MenuButton p={"2"} bg="none" w="100%" as={Button} leftIcon={<FiChevronDown />} overflow={"hidden"}>
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
export default SideBar;