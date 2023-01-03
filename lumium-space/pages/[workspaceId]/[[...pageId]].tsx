import React, { useState } from 'react';
import { Heading, Button, Divider, Modal, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Stack, useColorModeValue } from "@chakra-ui/react";
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
import { useFormik } from 'formik';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId, pageId } = router.query;
    const workspace = useWorkspace(workspaceId);
    const { userInfo } = useUserInfo();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [passwordEntered, setPasswordEntered] = useState(false);
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
        <Authenticator>
            <Box minH="100vh">
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size={{ base: "full", md: "xs" }}
                >
                    <DrawerContent>
                        <SideBar
                            onSelfClose={onClose}
                            workspace={workspace}
                            userInfo={userInfo}
                            logo={logo}
                            backgroundColor={backgroundColor}
                            disclaimerButtonColor={disclaimerButtonColor}
                        />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav onOpen={onOpen} userInfo={userInfo} workspace={workspace} />
                <Box p="4">
                    {
                        (workspace?.name && userInfo?.nickName && !pageId) &&
                        <Heading>
                            Welcome to the <em>{workspace?.name}</em> workspace, {userInfo?.nickName}!
                        </Heading> ||
                        !passwordEntered &&
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
                                    Enter the password for "{workspace?.name}"
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
                                    <Stack spacing={6}>
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
                        || pageId &&
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
