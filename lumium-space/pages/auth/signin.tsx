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
import React, { useState } from 'react'
import { useApi } from '@hooks/api';
import Router from 'next/router';
import { AUTH_PASSWORD_RESET, AUTH_SIGNIN, AUTH_SIGNUP, ROOT, SPACES_NEW } from '@routes/space';
import { useUserInfo } from '@hooks/api';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AuthBox } from '@components/auth/AuthBox';
import { useFormik } from 'formik';
import { ReasonDTO } from '@types';

const SignIn: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [api] = useApi();
    const { refetchUserInfo } = useUserInfo();

    const handleSignIn = () => {
        const email = formik.values.email;
        const password = formik.values.password;
        api.post<ReasonDTO>(AUTH_SIGNIN, {
            "email": email,
            "password": password
        }, { withCredentials: true }).then((res) => {
            if (res.status == 200) {
                refetchUserInfo().then((info) => {
                    if (info?.recentWorkspace?.id) {
                        Router.push(ROOT + info?.recentWorkspace?.id);
                    } else {
                        Router.push(SPACES_NEW);
                    };
                });
            }
        }).catch((err) => {
            if (err.response.data.status == "INVALID_CREDENTIALS") {
                setError("Invalid credentials");
            } else if (err.response.data.status == "EMAIL_DOES_NOT_EXIST") {
                setError("Email does not exist");
            }
        });
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: handleSignIn,
        validateOnChange: (false),
    });

    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);

    return (
        <AuthBox title="Sign in to your account" logo={logo}>
            <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                <Stack spacing={4}>
                    <FormControl id="email" isRequired isInvalid={error != null}>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            name={"email"}
                            type={"email"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            data-cy="emailInput"
                        />
                    </FormControl>
                    <FormControl id="password" isRequired isInvalid={error != null}>
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
                        <FormErrorMessage data-cy="signInError">{error}</FormErrorMessage>
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
