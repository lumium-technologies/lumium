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
    Text,
    useColorModeValue,
    InputGroup,
    InputRightElement,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { useApi } from "@hooks/api";
import Router from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AUTH_SIGNUP, EMAIL_EXISTS, EMAIL_VERIFY, EMAIL_VERIFY_TOKEN, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api/useUserInfo';
import { useEnter } from '@hooks/useEnter';

export default function SignUp() {
    const inputEmail = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState(false);
    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const inputPasswordVerify = useRef<HTMLInputElement>(null);
    const [api] = useApi();
    const userInfo = useUserInfo();
    const [showPassword, setShowPassword] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

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

    const handleSignUp = () => {
        const email = inputEmail.current?.value;
        const password = inputPassword.current?.value;
        const passwordVerify = inputPasswordVerify.current?.value;

        setEmailError(email == '');
        setPasswordError(password == '');
        setPasswordMatchError(password != passwordVerify);
        if (email != '' && password != '' && passwordVerify != '') {
            if (password == passwordVerify) {
                api.get(EMAIL_EXISTS, { params: { email } }).then((response) => response.data).then(email => email.exists).then(value => {
                    if (!value) {
                        api.post(AUTH_SIGNUP, {
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
                        }).then(() => {
                            api.post(EMAIL_VERIFY_TOKEN);
                        }).then(() => Router.push(EMAIL_VERIFY));
                    } else {
                        setEmailExistsError(true);
                        setEmailError(true);
                    }
                })
            } else {
                setPasswordMatchError(true)
            }
        }
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
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Sign up
                        </Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired isInvalid={emailError || emailExistsError}>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    ref={inputEmail}
                                    onKeyPress={event => useEnter(handleSignUp, event)}
                                    data-cy="signUpEmailInput"
                                />
                                {
                                    emailError && (<FormErrorMessage>Email is required.</FormErrorMessage>) ||
                                    emailExistsError && (<FormErrorMessage>Email already exists.</FormErrorMessage>)
                                }
                            </FormControl>
                            <FormControl id="password" isRequired isInvalid={passwordError}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        ref={inputPassword}
                                        onKeyPress={event => useEnter(handleSignUp, event)}
                                        data-cy="signUpPasswordInput"
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
                                {passwordError && (<FormErrorMessage>Password is required.</FormErrorMessage>)}
                            </FormControl>
                            <FormControl id="password-verify" isRequired isInvalid={passwordMatchError}>
                                <FormLabel>Repeat Password</FormLabel>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    ref={inputPasswordVerify}
                                    onKeyPress={event => useEnter(handleSignUp, event)}
                                    data-cy="signUpPasswordVerifyInput"
                                />
                                {passwordMatchError && (<FormErrorMessage>Password do not match.</FormErrorMessage>)}
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}
                                    onClick={handleSignUp}
                                    data-cy="submitSignUpButton"
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already a user? <Link color={'blue.400'} onClick={() => Router.push("/auth/signin")}>Login</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Flex>
    )
}
