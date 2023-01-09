import { BoxProps, Image, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Stack, CloseButton, Menu, MenuButton, Button, MenuList, MenuItem, Divider, Icon, FlexProps, IconButton, useColorModeValue } from "@chakra-ui/react";
import { CreateWorkspace, WorkspaceSideBarButton } from "@components/other";
import { WorkspaceDTO, UserDTO } from "@types";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { AiFillPushpin, AiFillStar } from "react-icons/ai";
import { BsFillPinFill } from "react-icons/bs";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, BORDER_DARK, BORDER_LIGHT, LOGO_DARK, LOGO_LIGHT } from "@definitions/constants";
import Router from "next/router";

interface SidebarProps extends BoxProps {
    onCloseSideBar: () => void;
    workspace: WorkspaceDTO | undefined;
    userInfo: UserDTO | undefined;
    setPinnedSideBar: (bool: any) => void;
    pinnedSideBar: boolean;
    sidebarWidth?: string;
}

export const SideBar = ({ onCloseSideBar, workspace, userInfo, setPinnedSideBar, pinnedSideBar, sidebarWidth = "100%", ...rest }: SidebarProps) => {
    const backgroundColor = useColorModeValue(BACKGROUND_LIGHT, BACKGROUND_DARK);
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

    return (
        <Flex
            flexDir={"column"}
            h="auto"
            minH={"100%"}
            width={"100%"}
            maxW={sidebarWidth}
            backgroundColor={backgroundColor}
            borderRightWidth="1px"
            borderRightColor={useColorModeValue(BORDER_LIGHT, BORDER_DARK)}
            {...rest}
        >
            <Modal isOpen={isOpenModal} onClose={onCloseModal} size={{ base: "full", md: "md" }}>
                <ModalOverlay />
                <ModalContent maxW={{ base: "100%", md: "40%" }} backgroundColor={backgroundColor}>
                    <ModalBody p={"0px"}>
                        <ModalCloseButton mt={"9px"} mr={"7px"} />
                        <CreateWorkspace standalone={false} />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex p="1vh 1vh 1vh 0vh" maxH={"9vh"} alignItems="center" justifyContent="center">
                <Stack align={'center'} maxH="100%" maxW="100%">
                    <Image
                        src={useColorModeValue(LOGO_DARK, LOGO_LIGHT)}
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
                                    return <WorkspaceSideBarButton w={w} key={w.id} />;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.administratedWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.administratedWorkspaces.map((w) => {
                                    return <WorkspaceSideBarButton w={w} key={w.id} />;
                                })}
                                <Divider />
                            </>
                        }
                        {userInfo?.visitorWorkspaces?.length != 0 &&
                            <>
                                {userInfo?.visitorWorkspaces.map((w) => {
                                    return <WorkspaceSideBarButton w={w} key={w.id} />;
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
                workspace?.pages.map((page) => (
                    <Button leftIcon={<AiFillStar />} bg="none" justifyContent={{ base: "center", md: "flex-start" }} key={page.name} as={Button} onClick={() => Router.push(`${workspace?.id}/${page.id}`)}>
                        {page.name}
                    </Button>
                ))
            }
        </Flex >
    );
};
