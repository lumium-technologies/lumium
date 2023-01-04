import { BoxProps, Image, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Stack, CloseButton, Menu, MenuButton, Button, MenuList, MenuItem, Divider, Icon, FlexProps, IconButton, useColorModeValue } from "@chakra-ui/react";
import { CreateWorkspace, WorkspaceSideBarButton } from "@components/other";
import { WorkspaceDTO, UserDTO } from "@types";
import { ReactElement, ReactText } from "react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiChevronDown, FiLock, FiPlus } from "react-icons/fi";
import { AiFillPushpin } from "react-icons/ai";
import { BsFillPinFill } from "react-icons/bs";

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
    onCloseSideBar: () => void;
    workspace: WorkspaceDTO | undefined;
    userInfo: UserDTO | undefined;
    logo: string;
    disclaimerButtonColor: string;
    setPinnedSideBar: (bool: any) => void;
    pinnedSideBar: boolean;
    sidebarWidth?: string;
}

export const SideBar = ({ onCloseSideBar, workspace, userInfo, logo, disclaimerButtonColor, setPinnedSideBar, pinnedSideBar, sidebarWidth, ...rest }: SidebarProps) => {
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal
    } = useDisclosure();

    const handlePinned = () => {
        if (pinnedSideBar) {
            setPinnedSideBar(false);
        } else {
            setPinnedSideBar(true);
        }
    }
    if (!sidebarWidth) {
        sidebarWidth = "100%";
    }
    const backgroundColor = useColorModeValue('#ffffff', '#1a1a1a');
    return (
        <Flex
            flexDir={"column"}
            h="auto"
            minH={"100%"}
            width={"100%"}
            maxW={sidebarWidth}
            backgroundColor={backgroundColor}
            borderRightWidth="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            {...rest}
        >
            <Modal isOpen={isOpenModal} onClose={onCloseModal}>
                <ModalOverlay />
                <ModalContent maxW={800}>
                    <ModalHeader>Create a new workspace</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <CreateWorkspace disclaimerButtonColor={disclaimerButtonColor} />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex pt="1vh" pb="1vh" maxH={"9vh"} alignItems="center" justifyContent="center">
                <Stack align={'center'} maxH="100%" maxW="100%">
                    <Image
                        src={logo}
                        minWidth={"70%"}
                        maxWidth={"80%"}
                        maxH={"9vh"}
                        alt="lumium logo"
                    />
                </Stack>
                <Flex flexDirection={"column"}>
                    {!pinnedSideBar && (<CloseButton display={'flex'} onClick={onCloseSideBar} />)}
                    <IconButton bg={"none"} aria-label="PinIcon" icon={!pinnedSideBar && <AiFillPushpin /> || <BsFillPinFill />} onClick={handlePinned} size={"sm"} display={{ base: "none", md: "flex" }} />
                </Flex>
            </Flex>
            {
                workspace?.name &&
                <Menu matchWidth={true}>
                    <MenuButton bg="none" w="100%" as={Button} leftIcon={<FiChevronDown />} justifyContent={{ base: "center", md: "flex-start" }}>
                        {workspace?.name}
                    </MenuButton>
                    <MenuList bg={backgroundColor} overflow={"hidden"}>
                        {userInfo?.ownedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.ownedWorkspaces.map((w) => {
                                    return <WorkspaceSideBarButton w={w} />;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.administratedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.administratedWorkspaces.map((w) => {
                                    return <WorkspaceSideBarButton w={w} />;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.visitorWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.visitorWorkspaces.map((w) => {
                                    return <WorkspaceSideBarButton w={w} />;
                                })}
                                <Divider />
                            </>
                        }
                        <Button width={"100%"} leftIcon={<FiPlus />} bg="none" onClick={onOpenModal}>New workspace</Button>
                    </MenuList>
                </Menu >
            }
            <Divider />
            <Button leftIcon={<FiPlus />} bg="none" as={Button} justifyContent={{ base: "center", md: "flex-start" }}>
                New page
            </Button>
            <Divider />
            {
                LinkItems.map((link) => (
                    <Button leftIcon={link.icon} bg="none" justifyContent={{ base: "center", md: "flex-start" }} key={link.name} as={Button}>
                        {link.name}
                    </Button>
                ))
            }
        </Flex >
    );
};
