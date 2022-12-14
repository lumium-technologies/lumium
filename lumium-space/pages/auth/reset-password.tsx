import { InfoIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Image, Box, Button, Fade, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, ScaleFade, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { AuthBox } from "@components/auth/AuthBox";
import { useApi } from "@hooks/api";
import { AUTH_SIGNIN, EMAIL_EXISTS, PASSWORD_RESET, PASSWORD_RESET_TOKEN, ROOT } from "@routes/space";
import Router, { useRouter } from 'next/router';
import { useState } from "react";
import { useFormik } from 'formik';

const ResetPassword: React.FC = () => {
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailResent, setEmailResent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [api] = useApi();
    const router = useRouter();
    const { token } = router.query;
    const handleResetPassword = () => {
        const email = formik.values.email;
        const emailExists = api.get(EMAIL_EXISTS, { params: { email } }).then((response) => response.data).then(email => email.exists);
        emailExists.then(value => {
            if (value) {
                api.post(PASSWORD_RESET_TOKEN, {
                    "formFields": [
                        {
                            "id": "email",
                            "value": email
                        }
                    ]
                });
                setEmailSent(true);
            } else {
                setEmailExistsError(true);
                formik.errors.email = "Email doesn't exist";
            };
        });
    };
    const handleChangePassword = () => {
        const password = formik.values.password;
        const passwordVerify = formik.values.passwordConfirm;
        if (password == passwordVerify) {
            api.post(PASSWORD_RESET, {
                "method": "token",
                "formFields": [
                    {
                        "id": "password",
                        "value": password
                    }
                ],
                "token": token
            }).then(() => Router.push(AUTH_SIGNIN));
        } else {
            setPasswordMatchError(true);
            formik.errors.passwordConfirm = "Passwords don't match."
        }
    };
    const handleResendEmail = () => {
        const email = formik.values.email;
        api.post(PASSWORD_RESET_TOKEN, {
            "formFields": [
                {
                    "id": "email",
                    "value": email
                }
            ]
        });
        setEmailResent(true);
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            passwordConfirm: "",
        },
        onSubmit: () => {
            if (!!formik.values.email) {
                handleResetPassword();
            } else {
                handleChangePassword();
            }
        },
        validateOnChange: (false),
    });
    const resetPasswordEmail = (
        <AuthBox title="Forgot your password">
            <Stack spacing={4}>
                <Text
                    fontSize={{ base: 'sm', sm: 'md' }}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    You&apos;ll receive an email with a reset link
                </Text>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl id="email" isRequired isInvalid={emailExistsError}>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            name={"email"}
                            type={"email"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            data-cy="emailInput"
                        />
                        <FormErrorMessage data-cy="emailError">{formik.errors.email}</FormErrorMessage>
                    </FormControl>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        type="submit"
                        data-cy="requestResetButton"
                    >
                        Request Reset
                    </Button>
                </form>
            </Stack>
        </AuthBox>
    );
    const emailSentPage = (
        <Box textAlign="center" py={10} px={6}>
            <InfoIcon boxSize={'50px'} color={'blue.500'} />
            {!emailResent &&
                <>
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Check your Email
                    </Heading>
                    <Text color={'gray.500'}>
                        Check your inbox to reset your password
                    </Text>
                    <Button onClick={() => { handleResendEmail() }} data-cy="resendButton">
                        Resend E-Mail
                    </Button>
                </>
                ||
                <Heading as="h2" size="xl" mt={6} mb={2} data-cy="resendHeader">
                    E-Mail has been resent
                </Heading>
            }
        </Box>
    );
    const changePassword = (
        <AuthBox title="Enter new password">
            <Stack spacing={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl id="password" isRequired >
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
                    </FormControl>
                    <FormControl id="password-verify" isRequired isInvalid={passwordMatchError}>
                        <FormLabel>Repeat Password</FormLabel>
                        <Input
                            name={"passwordConfirm"}
                            type={'password'}
                            onChange={formik.handleChange}
                            value={formik.values.passwordConfirm}
                            data-cy="passwordConfirmInput"
                        />
                        <FormErrorMessage>{formik.errors.passwordConfirm}</FormErrorMessage>
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            type={"submit"}
                        >
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </AuthBox>
    );

    return (
        <Fade in={true}>
            {token && changePassword || emailSent && emailSentPage || resetPasswordEmail}
        </Fade>
    );
};

export default ResetPassword;