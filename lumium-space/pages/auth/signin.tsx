import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    Spacer,
    Fade,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from "@hooks/api";
import Router, { useRouter } from 'next/router';
import { useLoginStatus } from '@hooks/security';
import { UserDTO, WorkspaceDTO } from "@types";
import { SECURE_USER_GET } from '@routes/api/v1';
import { AUTH_SIGNIN, SPACES_NEW } from '@routes/space';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [api] = useApi();
    const [recentWorkspace, setRecentWorkspace] = useState<WorkspaceDTO>();
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter()
    const redirectionURL = router.query.redirectionURL + ""
    useLoginStatus().then((val) => {
        setLoggedIn(val);
    });
    useEffect(() => {
        if (loggedIn) {
            api.get<UserDTO>(SECURE_USER_GET).then((res) => {
                setRecentWorkspace(res.data.recentWorkspace);
                if (recentWorkspace) {
                    Router.push('/' + recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                }
            });
        }
    }, [loggedIn, api, recentWorkspace]);
    const handleSignIn = () => {
        console.log(AUTH_SIGNIN)
        api.post(AUTH_SIGNIN, {
            "formFields": [
                {
                    "id": "email",
                    "value": email
                },
                {
                    "id": "password",
                    "value": password
                }
            ]
        }).then((promise) => promise.data).then((status) => {
            if (status.status == "OK" && !redirectionURL) {
                api.get<UserDTO>(SECURE_USER_GET).then((res) => {
                    setRecentWorkspace(res.data.recentWorkspace);
                    if (recentWorkspace) {
                        Router.push('/' + recentWorkspace.id);
                    } else {
                        Router.push(SPACES_NEW);
                    }
                });
            } else if (redirectionURL) {
                Router.push(redirectionURL);
            } else {
                setCredentialsMatchError(true);
            };
        });
    };
    return (
        <Flex flexDir="column" minH={'100vh'}>
            <Flex
                minH={'93vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    onChange={event => setEmail(event.currentTarget.value)}
                                    data-cy="signInEmailInput"
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    onChange={event => setPassword(event.currentTarget.value)}
                                    data-cy="signInPasswordInput"
                                />
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    {/*<Checkbox>Remember me</Checkbox>*/}
                                    <Spacer />
                                    <Link color={'blue.400'} onClick={() => Router.push("/auth/reset-password")}>Forgot password?</Link>
                                </Stack>
                            </Stack>
                            <Flex justifyContent="flex-end" mt="0">
                                <Link color={'blue.400'} onClick={() => Router.push("/auth/signup")}>Create Account</Link>
                            </Flex>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSignIn}
                                data-cy="submitSignInButton"
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Flex >
            <Fade in={credentialsMatchError}>
                <Flex justifyContent="flex-end">
                    <Alert status='error' width="20%" mr="1%" borderRadius="10px">
                        <AlertIcon />
                        <AlertTitle>Email or Password is incorrect</AlertTitle>
                    </Alert>
                </Flex>
            </Fade>
        </Flex >
    )
}
