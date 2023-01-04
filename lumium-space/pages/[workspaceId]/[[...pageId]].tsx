import React, { useState } from 'react';
import { Heading, Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Stack, useColorModeValue, IconButton, position } from "@chakra-ui/react";
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
import { NavBar, SideBar } from '@sections/workspace';
import { useFormik } from 'formik';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { PageTitle } from '@components/other';
import NextLink from 'next/link';
import { RxDoubleArrowDown } from "react-icons/rx";

const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId, pageId } = router.query;
    const workspace = useWorkspace(workspaceId);
    const { userInfo } = useUserInfo();
    const { isOpen: isOpenSideBar, onOpen: onOpenSideBar, onClose: onCloseSideBar } = useDisclosure();
    const [passwordEntered, setPasswordEntered] = useState(false);
    const [pinnedSideBar, setPinnedSideBar] = useState(false);
    const [pinnedNavBar, setPinnedNavBar] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handlePasswordEntered = () => {
        setPasswordEntered(true);
    }
    const formik = useFormik({
        initialValues: {
            password: "",
        },
        onSubmit: handlePasswordEntered,
        validateOnChange: (false),
    });
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);
    let backgroundColor = useColorModeValue('#ffffff', '#1a1a1a');
    let disclaimerButtonColor = useColorModeValue('green', 'darkgreen');
    return (
        <>
            <PageTitle title={"Lumium | " + workspace?.name} />
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
                                    onSelfClose={onCloseSideBar}
                                    workspace={workspace}
                                    userInfo={userInfo}
                                    logo={logo}
                                    backgroundColor={backgroundColor}
                                    disclaimerButtonColor={disclaimerButtonColor}
                                    setPinnedSideBar={setPinnedSideBar}
                                    pinnedSideBar={pinnedSideBar}
                                    sidebarWidth={"100%"}
                                />
                            </DrawerContent>
                        </Drawer>
                    ) ||
                        (
                            <SideBar
                                workspace={workspace}
                                userInfo={userInfo}
                                logo={logo}
                                backgroundColor={backgroundColor}
                                disclaimerButtonColor={disclaimerButtonColor}
                                setPinnedSideBar={setPinnedSideBar}
                                pinnedSideBar={pinnedSideBar}
                                sidebarWidth={"320px"}
                            />
                        )
                    }
                    {/* mobilenav */}
                    <Flex flexDirection={"column"} width={"100%"} height={"100%"}>
                        {
                            pinnedNavBar && (
                                <NavBar onOpenSideBar={onOpenSideBar} userInfo={userInfo} workspace={workspace} pinnedSidebar={pinnedSideBar} setPinnedNavBar={setPinnedNavBar} />
                            )
                        }
                        <Box p="4">
                            {
                                !pinnedNavBar && (
                                    <IconButton aria-label="PinIcon" icon={<RxDoubleArrowDown />} onClick={() => { setPinnedNavBar(true) }} size={"sm"} right="5" position={"absolute"} />
                                )
                            }
                            {
                                (workspace?.name && userInfo?.nickName && !pageId && !passwordEntered) &&
                                <>
                                    <Heading>
                                        Welcome to the <em>{workspace?.name}</em> workspace, {userInfo?.nickName}!
                                    </Heading>
                                    <Flex
                                        align={'center'}
                                        justify={'center'}
                                    >
                                        <Stack
                                            spacing={4}
                                            w={'full'}
                                            maxW={'md'}
                                            rounded={'xl'}
                                            boxShadow={'lg'}
                                            p={6}
                                            my={12}>
                                            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                                                Enter the password for <em>{workspace?.name}</em>
                                            </Heading>
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
                                        </Stack>
                                    </Flex>
                                </>
                                || pageId &&
                                <Flex flexDir="row">
                                    <Textarea />
                                    <LumiumRenderer />
                                </Flex>
                            }
                            {
                                workspace?.pages.map((p) => {
                                    return (
                                        <Button key={p.id} as={NextLink} href={p.id}></Button>
                                    );
                                })
                            }
                        </Box>
                    </Flex>
                </Flex>
            </Authenticator>
        </>
    );
};

export default Workspace;
