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
    Text,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from '@hooks/api';
import Router from 'next/router';
import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api';
import { useRef } from 'react';

export const SignIn: React.FC = () => {
    const inputEmail = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState(false);
    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [api] = useApi();
    const userInfo = useUserInfo();

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
            if (status.status == "OK") {
                if (userInfo?.recentWorkspace) {
                    Router.push('/' + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                }
            } else if (status.status == "FIELD_ERROR" || status.status == "WRONG_CREDENTIALS_ERROR") {
                if (email != '' && password != '') {
                    setCredentialsMatchError(true);
                }
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
                                    onKeyPress={event => { if (event.key == 'Enter') handleSignIn() }}
                                    data-cy="signInEmailInput"
                                />
                                {emailError && (<FormErrorMessage>E-Mail is required.</FormErrorMessage>)}
                            </FormControl>
                            <FormControl id="password" isRequired isInvalid={passwordError || credentialsMatchError}>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    ref={inputPassword}
                                    onKeyPress={event => { if (event.key == 'Enter') handleSignIn() }}
                                    data-cy="signInPasswordInput"
                                />
                                {
                                    passwordError && (<FormErrorMessage>Password is required.</FormErrorMessage>) ||
                                    credentialsMatchError && <FormErrorMessage>E-Mail or Password incorrect</FormErrorMessage>
                                }
                            </FormControl>
                            <Flex justifyContent="space-between" mt="0">
                                <Link color={'blue.400'} onClick={() => Router.push(AUTH_PASSWORD_RESET)}>Forgot password?</Link>
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
                            <Flex flexDir="column" alignItems={"center"}>
                                <Text mb={"0"}>
                                    Create a new account?
                                </Text>
                                <Link color={'blue.400'} onClick={() => Router.push(AUTH_SIGNUP)}>Create Account</Link>
                            </Flex>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Flex>
    );
};

export default SignIn;
