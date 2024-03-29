import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Text,
    FormErrorMessage,
    InputRightElement,
    InputGroup
} from '@chakra-ui/react';
import React, { useState } from 'react'
import Router from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { WidgetCentered, PageTitle } from '@components/other';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import { get_api_v1_auth_signin, get_space_spaces_create, SignInDTO } from 'lumium-renderer';
import { useApi } from '@hooks/useApi';

const SignIn: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<any | null>(null);
    const [api] = useApi();

    const handleSignIn = () => {
        const email = formik.values.email;
        const password = formik.values.password;
        api.post<SignInDTO>(get_api_v1_auth_signin(), { email, password }).then((res) => {
            if (res.status == 200) {
                Router.push(get_space_spaces_create());
            }
        }).catch((err) => setError(err.response?.data));
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: handleSignIn,
        validateOnChange: (false),
    });


    return (
        <>
            <PageTitle title={"Lumium | Sign In"} />
            <WidgetCentered title="Sign in to your account">
                <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                    <Stack spacing={4}>
                        <FormControl id="email" isRequired isInvalid={error?.status == "EMAIL_DOES_NOT_EXIST"}>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                name={"email"}
                                type={"email"}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                data-cy="emailInput"
                            />
                            <FormErrorMessage data-cy="emailError">{error?.reason}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="password" isRequired isInvalid={error?.status == "INVALID_CREDENTIALS"}>
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
                            <FormErrorMessage data-cy="credentialError">{error?.reason}</FormErrorMessage>
                        </FormControl>
                        <Flex justifyContent="space-between" mt="0">
                            <Link color={'blue.400'} data-cy="forgotPasswordButton" as={NextLink} href={""/*AUTH_PASSWORD_RESET*/}>Forgot password?</Link>
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
                            <Link color={'blue.400'} data-cy="signUpSwitchButton" as={NextLink} href={""/*AUTH_SIGNUP*/}>Create Account</Link>
                        </Flex>
                    </Stack>
                </form>
            </WidgetCentered>
        </>
    );
};

export default SignIn;
