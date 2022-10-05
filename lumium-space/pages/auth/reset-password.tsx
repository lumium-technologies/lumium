import { InfoIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useApi } from "@hooks/api";
import { AxiosResponse } from "axios";
import Router, { useRouter } from 'next/router';
import { useState } from "react";

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShown, setIsShown] = useState(false);
    const [resendIsShown, setResendIsShown] = useState(false);
    const [emailExistsIsShown, setEmailExistsIsShown] = useState(false);
    const [api] = useApi();
    const router = useRouter();
    const { token } = router.query;
    const handleResetPassword = () => {
        const emailExists = api.get("/auth/signup/email/exists", { params: { email } }).then((response) => response.data).then(email => email.exists);
        emailExists.then(value => {
            if (value) {
                api.post("/auth/user/password/reset/token", {
                    "formFields": [
                        {
                            "id": "email",
                            "value": email
                        }
                    ]
                });
                setIsShown(true);
            } else {
                alert("Email does not exist")
                setEmailExistsIsShown(true);
            }
        })
    };
    const handleChangePassword = () => {
        api.post("/auth/user/password/reset", {
            "method": "token",
            "formFields": [
                {
                    "id": "password",
                    "value": password
                }
            ],
            "token": token
        }).then(() => Router.push("/auth"));
    };
    const handleResendEmail = () => {
        api.post("/auth/user/password/reset/token", {
            "formFields": [
                {
                    "id": "email",
                    "value": email
                }
            ]
        });
        setIsShown(false);
        setResendIsShown(true);
    };
    const resetPasswordEmail =
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                    Forgot your password?
                </Heading>
                <Text
                    fontSize={{ base: 'sm', sm: 'md' }}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    You&apos;ll get an email with a reset link
                </Text>
                <FormControl id="email">
                    <Input
                        placeholder="your-email@example.com"
                        _placeholder={{ color: 'gray.500' }}
                        type="email"
                        onChange={event => setEmail(event.currentTarget.value)}
                    />
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={handleResetPassword}>
                        Request Reset
                    </Button>
                </Stack>
            </Stack>
        </Flex>
        ;

    const changePassword =
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                    Enter new password
                </Heading>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" onChange={event => setPassword(event.currentTarget.value)} />
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={handleChangePassword}>
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
        ;
    const emailSentPage =
        <Box textAlign="center" py={10} px={6}>
            <InfoIcon boxSize={'50px'} color={'blue.500'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                Check your Email
            </Heading>
            <Text color={'gray.500'}>
                Check your inbox to reset your password
            </Text>
            <Button onClick={handleResendEmail}>
                Resend E-Mail
            </Button>
        </Box>
        ;
    const emailResendPage =
        <Box textAlign="center" py={10} px={6}>
            <InfoIcon boxSize={'50px'} color={'blue.500'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                E-Mail has been resend
            </Heading>
            <Text color={'gray.500'}>
                Check your inbox to reset your password
            </Text>
        </Box>
        ;
    return (
        token && changePassword || isShown && emailSentPage || resendIsShown && emailResendPage || resetPasswordEmail
    )
}