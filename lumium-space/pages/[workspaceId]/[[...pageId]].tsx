import React, { useEffect, useState } from 'react';
import { Heading, Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Stack, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
    Textarea,
    Flex,
    Drawer,
    DrawerContent,
    useDisclosure,
} from '@chakra-ui/react';
import { Authenticator } from '@components/security/Authenticator';
import { LumiumRenderer } from '@components/rendering';
import { NavBar, SideBar } from '@sections/workspace';
import { useFormik } from 'formik';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { WidgetCentered, PageTitle } from '@components/other';
import NextLink from 'next/link';
import { RxDoubleArrowDown } from "react-icons/rx";
import { get_local_storage_password_key as pass, WorkspaceDTODecrypted, get_workspace } from 'lumium-renderer';

const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId, pageId } = router.query;
    // const { workspace, refetchWorkspace } = useWorkspace(workspaceId);
    // const { userInfo } = useUserInfo();
    const [workspace, setWorkspace] = useState<WorkspaceDTODecrypted | null>();
    const [passwordEntered, setPasswordEntered] = useState(false);
    const [pinnedSideBar, setPinnedSideBar] = useState(false);
    const [pinnedNavBar, setPinnedNavBar] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [mount, didMount] = useState(false);
    const {
        isOpen: isOpenSideBar,
        onOpen: onOpenSideBar,
        onClose: onCloseSideBar
    } = useDisclosure();

    const handlePasswordEntered = () => {
        localStorage.setItem(pass(), formik.values.password);
        setPasswordEntered(true);
        get_workspace(workspaceId as string).then(wrk => setWorkspace(wrk));
    }

    useEffect(() => {
        const workspacePassword = localStorage.getItem(pass());
        setPasswordEntered(workspacePassword != null);
        get_workspace(workspaceId as string).then(wrk => setWorkspace(wrk));
        const localPinnedSideBar = localStorage.getItem('pinnedSideBar');
        const localPinnedNavBar = localStorage.getItem('pinnedNavBar');
        if (localPinnedSideBar !== null && localPinnedNavBar !== null && !mount) {
            setPinnedSideBar(JSON.parse(localPinnedSideBar));
            setPinnedNavBar(JSON.parse(localPinnedNavBar));
            didMount(true);
        }
        localStorage.setItem('pinnedSideBar', JSON.stringify(pinnedSideBar));
        localStorage.setItem('pinnedNavBar', JSON.stringify(pinnedNavBar));
    }, [pinnedSideBar, pinnedNavBar, mount]);

    const formik = useFormik({
        initialValues: {
            password: "",
        },
        onSubmit: handlePasswordEntered,
        validateOnChange: (false),
    });

    return (
        <>
            <PageTitle title={workspace?.name && "Lumium | " + workspace?.name || "Lumium"} />
            <Authenticator>
                <Flex width={"100%"} minHeight={"100vh"} flexDirection={"row"}>
                    {!pinnedSideBar && (
                        <Drawer
                            autoFocus={false}
                            isOpen={isOpenSideBar}
                            placement="left"
                            onClose={onCloseSideBar}
                            returnFocusOnClose={false}
                            onOverlayClick={onCloseSideBar}
                            size={{ base: "full", md: "xs" }}
                        >
                            <DrawerContent>
                                <SideBar
                                    onCloseSideBar={onCloseSideBar}
                                    // workspace={workspace}
                                    // userInfo={userInfo}
                                    setPinnedSideBar={setPinnedSideBar}
                                    pinnedSideBar={pinnedSideBar}
                                />
                            </DrawerContent>
                        </Drawer>
                    ) ||
                        (
                            <SideBar
                                onCloseSideBar={onCloseSideBar}
                                // workspace={workspace}
                                // userInfo={userInfo}
                                setPinnedSideBar={setPinnedSideBar}
                                pinnedSideBar={pinnedSideBar}
                                sidebarWidth={"320px"}
                            />
                        )
                    }
                    <Flex flexDirection={"column"} width={"100%"} height={"100%"}>
                        {
                            pinnedNavBar && (
                                <NavBar
                                    onOpenSideBar={onOpenSideBar}
                                    // userInfo={userInfo}
                                    // workspace={workspace}
                                    pinnedSidebar={pinnedSideBar}
                                    setPinnedNavBar={setPinnedNavBar}
                                />
                            )
                        }
                        <Flex
                            pl={{ base: "4%", md: "2%" }}
                            pr={{ base: "4%", md: "2%" }}
                            pt={"2vh"}
                            pb={"2vh"}
                            width="auto"
                            flexDir={"column"}
                        >
                            {
                                !pinnedNavBar && (
                                    <Flex width="100%" justifyContent={"flex-end"}>
                                        <IconButton
                                            aria-label="pin navbar"
                                            size="md"
                                            variant="outline"
                                            icon={<RxDoubleArrowDown />}
                                            onClick={() => {
                                                setPinnedNavBar(true)
                                            }}
                                            position="absolute"
                                        />
                                    </Flex>
                                )
                            }
                            {
                                // (workspace?.name && userInfo?.nickName && !pageId) &&
                                // <Heading>
                                //     Welcome to the <em>{workspace?.name}</em> workspace, {userInfo?.nickName}!
                                // </Heading>
                            }
                            {
                                !passwordEntered &&
                                <>
                                    <WidgetCentered title={"Enter the workspace password"} logo={false}>
                                        <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                                            <FormControl id="password" isRequired>
                                                <FormLabel>Password</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        name={"password"}
                                                        type={showPassword ? 'text' : 'password'}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.password}
                                                        data-cy="passwordInput"
                                                    />
                                                    <InputRightElement h={'full'}>
                                                        <Button
                                                            variant={'ghost'}
                                                            onClick={() =>
                                                                setShowPassword((showPassword) => !showPassword)
                                                            }>
                                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                <FormErrorMessage data-cy="credentialError"></FormErrorMessage>
                                            </FormControl>
                                            <Stack spacing={6} mt={"2%"}>
                                                <Button
                                                    bg={'blue.400'}
                                                    color={'white'}
                                                    _hover={{
                                                        bg: 'blue.500',
                                                    }}
                                                    type="submit"
                                                >
                                                    Submit
                                                </Button>
                                            </Stack>
                                        </form>
                                    </WidgetCentered>
                                </>
                                || pageId &&
                                <Flex flexDir="row">
                                    <Textarea />
                                    <LumiumRenderer />
                                </Flex>
                            }
                            {
                                // workspace?.pages?.map((p) => {
                                //     return (
                                //         <Button key={p.id} as={NextLink} href={p.id}></Button>
                                //     );
                                // })
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </Authenticator>
        </>
    );
};

export default Workspace;
