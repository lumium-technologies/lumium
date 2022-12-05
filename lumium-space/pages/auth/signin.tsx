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
    Spacer,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from '@hooks/api';
import Router, { useRouter } from 'next/router';
import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api/useUserInfo';
import { useRef } from 'react';
import { useEnter } from '@hooks/useEnter';

export default function SignIn() {
    const inputEmail = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState(false);
    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [api] = useApi();
    const router = useRouter();
    const userInfo = useUserInfo();
    const redirectTo = router.query.redirectTo + ""

    useEffect(() => {
        Session.doesSessionExist().then((loggedIn) => {
            if (loggedIn) {
                if (userInfo?.recentWorkspace) {
                    Router.push('/' + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                };
            };
        });
    }, [userInfo?.recentWorkspace]);

    const handleSignIn = () => {
        const email = inputEmail.current?.value;
        const password = inputPassword.current?.value;

        setEmailError(email == '');
        setPasswordError(password == '');
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
            if (status.status == "OK" && !redirectTo) {
                if (userInfo?.recentWorkspace) {
                    Router.push('/' + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                }
            } else if (status.status == "FIELD_ERROR" || status.status == "WRONG_CREDENTIALS_ERROR") {
                if (email != '' && password != '') {
                    setCredentialsMatchError(true);
                }

            } else {
                Router.push(redirectTo);
            }
        });
    };

    return (
        <Flex flexDir="column" minH={'100vh'}>
            <Flex
                minH={'93vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} width="100%">
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired isInvalid={emailError || credentialsMatchError}>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    ref={inputEmail}
                                    onKeyPress={event => useEnter(handleSignIn, event)}
                                    data-cy="signInEmailInput"
                                />
                                {emailError && (<FormErrorMessage>E-Mail is required.</FormErrorMessage>)}
                            </FormControl>
                            <FormControl id="password" isRequired isInvalid={passwordError || credentialsMatchError}>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    ref={inputPassword}
                                    onKeyPress={event => useEnter(handleSignIn, event)}
                                    data-cy="signInPasswordInput"
                                />
                                {
                                    passwordError && (<FormErrorMessage>Password is required.</FormErrorMessage>) ||
                                    credentialsMatchError && <FormErrorMessage>E-Mail or Password incorrect</FormErrorMessage>
                                }
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    <Spacer />
                                    <Link color={'blue.400'} onClick={() => Router.push(AUTH_PASSWORD_RESET)}>Forgot password?</Link>
                                </Stack>
                            </Stack>
                            <Flex justifyContent="flex-end" mt="0">
                                <Link color={'blue.400'} onClick={() => Router.push(AUTH_SIGNUP)}>Create Account</Link>
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
            </Flex>
        </Flex>
    )
}
