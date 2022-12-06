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
    Image
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useApi } from "@hooks/api";
import Router from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AUTH_SIGNIN, AUTH_SIGNUP, EMAIL_EXISTS, ROOT, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api';
import { AuthBox } from '@components/auth/AuthBox';

const SignUp: React.FC = () => {
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
                        }).then(() => Router.push(SPACES_NEW));
                    } else {
                        setEmailExistsError(true);
                        setEmailError(true);
                    };
                });
            } else {
                setPasswordMatchError(true)
            };
        };
    };

    return (
        <AuthBox title="Create your account">
            <Stack spacing={4}>
                <FormControl id="email" isRequired isInvalid={emailError || emailExistsError}>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        type="email"
                        ref={inputEmail}
                        onKeyPress={event => { if (event.key == 'Enter') handleSignUp() }}
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
                            onKeyPress={event => { if (event.key == 'Enter') handleSignUp() }}
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
                        type={'password'}
                        ref={inputPasswordVerify}
                        onKeyPress={event => { if (event.key == 'Enter') handleSignUp() }}
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
                <Flex flexDir="column" alignItems={"center"}>
                    <Text mb={"0"}>
                        Already an account?
                    </Text>
                    <Link color={'blue.400'} onClick={() => Router.push(AUTH_SIGNIN)}>Login</Link>
                </Flex>
            </Stack>
        </AuthBox>
    );
};

export default SignUp;