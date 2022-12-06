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
    Image,
    InputRightElement,
    InputGroup
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from '@hooks/api';
import Router from 'next/router';
import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, ROOT, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api';
import { useRef } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AuthBox } from '@components/auth/AuthBox';

const SignIn: React.FC = () => {
    const inputEmail = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState(false);
    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                };
            } else if (status.status == "FIELD_ERROR" || status.status == "WRONG_CREDENTIALS_ERROR") {
                if (email != '' && password != '') {
                    setCredentialsMatchError(true);
                };
            };
        });
    };

    return (
        <AuthBox title="Sign in to your account">
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
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            ref={inputPassword}
                            onKeyPress={event => { if (event.key == 'Enter') handleSignIn() }}
                            data-cy="signInPasswordInput"
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
        </AuthBox>
    );
};

export default SignIn;
