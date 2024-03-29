import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Text,
    InputGroup,
    InputRightElement,
    FormErrorMessage
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Router from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { WidgetCentered, PageTitle } from '@components/other';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import { SignUpDTO, get_api_v1_auth_signup as signup, get_space_spaces_create } from 'lumium-renderer';
import { useApi } from '@hooks/useApi';

const SignUp: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<any | null>(null);

    const [api] = useApi();

    const handleSignUp = () => {
        const email = formik.values.email;
        const password = formik.values.password;
        const username = formik.values.nickName;
        api.post<SignUpDTO>(signup(), {
            email: email,
            password: password,
            username: username
        }).then((res) => {
            if (res.status == 200) {
                Router.push(get_space_spaces_create());
            }
        }, (err) => setError(err.response?.data));
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            nickName: "",
            password: "",
            passwordConfirm: "",
        },
        onSubmit: () => {
            if (formik.values.password == formik.values.passwordConfirm) {
                handleSignUp();
            } else {
                setError({ status: "PASSWORDS_DO_NOT_MATCH", reason: "Passwords don't match" });
            }
        },
        validateOnChange: (false),
    });

    return (
        <>
            <PageTitle title={"Lumium | Sign Up"} />
            <WidgetCentered title="Create your account" >
                <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                    <Stack spacing={4}>
                        <FormControl id="email" isRequired isInvalid={error?.status == "EMAIL_ALREADY_EXISTS"}>
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
                        <FormControl id="nickName" isRequired isInvalid={error?.status == "USERNAME_ALREADY_EXISTS"}>
                            <FormLabel>Username</FormLabel>
                            <Input name={"nickName"}
                                type={"username"}
                                onChange={formik.handleChange}
                                value={formik.values.nickName}
                                data-cy="nickNameInput"
                            />
                            <FormErrorMessage data-cy="userNameError">{error?.reason}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="password" isRequired isInvalid={error?.status == "PASSWORDS_DO_NOT_MATCH"}>
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
                            <FormErrorMessage data-cy="passwordError">{error?.reason}</FormErrorMessage>
                        </FormControl>
                        <FormControl id="passwordConfirmInput" isRequired isInvalid={error?.status == "PASSWORDS_DO_NOT_MATCH"}>
                            <FormLabel>Repeat Password</FormLabel>
                            <Input
                                name={"passwordConfirm"}
                                type={'password'}
                                onChange={formik.handleChange}
                                value={formik.values.passwordConfirm}
                                data-cy="passwordConfirmInput"
                            />
                            <FormErrorMessage data-cy="passwordConfirmError">{error?.reason}</FormErrorMessage>
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
                                data-cy="signUpButton"
                                type="submit"
                            >
                                Sign up
                            </Button>
                        </Stack>
                        <Flex flexDir="column" alignItems={"center"}>
                            <Text mb={"0"}>
                                Already have an account?
                            </Text>
                            <Link color={'blue.400'} data-cy="signInSwitchButton" as={NextLink} href={""/*AUTH_SIGNIN*/}>Login</Link>
                        </Flex>
                    </Stack>
                </form>
            </WidgetCentered>
        </>
    );
};

export default SignUp;
