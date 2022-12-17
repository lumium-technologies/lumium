import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Text,
    FormErrorMessage,
    InputRightElement,
    InputGroup,
    useColorModeValue
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from '@hooks/api';
import Router from 'next/router';
import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, ROOT, SPACES_NEW } from '@routes/space';
import { useUserInfo } from '@hooks/api';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AuthBox } from '@components/auth/AuthBox';
import { useFormik } from 'formik';

const SignIn: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [api] = useApi();
    const userInfo = useUserInfo();
    const handleSignIn = () => {
        const email = formik.values.email;
        const password = formik.values.password;
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
                setCredentialsMatchError(true);
            };
        });
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: () => {
            handleSignIn();
        },
        validateOnChange: (false),
    });
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);

    return (
        <AuthBox title="Sign in to your account" logo={logo}>
            <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                <Stack spacing={4}>
                    <FormControl id="email" isRequired isInvalid={credentialsMatchError}>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            name={"email"}
                            type={"email"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            data-cy="emailInput"
                        />
                    </FormControl>
                    <FormControl id="password" isRequired isInvalid={credentialsMatchError}>
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
                        <FormErrorMessage data-cy="passwordError">Wrong credentials.</FormErrorMessage>
                    </FormControl>
                    <Flex justifyContent="space-between" mt="0">
                        <Link color={'blue.400'} onClick={() => Router.push(AUTH_PASSWORD_RESET)} data-cy="forgotPasswordButton">Forgot password?</Link>
                    </Flex>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        type="submit"
                        data-cy="signInButton"
                    >
                        Sign in
                    </Button>

                    <Flex flexDir="column" alignItems={"center"}>
                        <Text mb={"0"}>
                            Create a new account?
                        </Text>
                        <Link color={'blue.400'} onClick={() => Router.push(AUTH_SIGNUP)} data-cy="signUpSwitchButton">Create Account</Link>
                    </Flex>
                </Stack>
            </form>
        </AuthBox>
    );
};

export default SignIn;
