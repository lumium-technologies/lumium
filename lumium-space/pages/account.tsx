import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Stack, StackDivider, Text, useColorModeValue } from "@chakra-ui/react";
import { PageTitle, WidgetCentered } from "@components/other";
import { Authenticator } from "@components/security/Authenticator";
import { BORDER_DARK, BORDER_LIGHT } from "@definitions/constants";
import { useApi, useUserInfo } from "@hooks/api";
import { SECURE_USER_DELETE } from "@routes/api/v1";
import { ROOT } from "@routes/space";
import { NavBar, SideBar } from "@sections/account";
import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useState } from "react";

const Account: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [api] = useApi();
    const [email, setEmail] = useState("");
    const [page, setPage] = useState("personalInfo");
    const { userInfo } = useUserInfo();
    const handleDelete = () => {
        api.delete(SECURE_USER_DELETE).then(() => Router.push(ROOT));
    };
    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirm: "",
        },
        onSubmit: () => {

        },
        validateOnChange: (false),
    });
    useEffect(() => {
        userInfo?.emails.map((e) => {
            if (e.primary) {
                setEmail(e.email);
            }
        });

        console.log(userInfo);
    }, [userInfo])
    return (
        <>
            <PageTitle title={"Lumium | Account"} />
            <Authenticator>
                <Flex width={"100%"} minHeight={"100vh"} flexDirection={"row"}>
                    <SideBar
                        setPage={setPage}
                    />
                    <Flex width={"100%"} flexDirection={"column"} >
                        <NavBar />
                        <Flex flexDirection={"column"} alignContent={"center"} height={"100%"} ml={"1vh"}>
                            {
                                page == "personalInfo" && (
                                    <WidgetCentered title="Personal Information" logo={false} width="70%">
                                        <Stack divider={<StackDivider borderColor={useColorModeValue(BORDER_LIGHT, BORDER_DARK)} />}>
                                            <Stack direction={"row"} >
                                                <Text fontSize="lg" ml={"2vh"} width={"20vh"}>Username</Text>
                                                <Text fontSize="lg" >{userInfo?.nickName}</Text>
                                            </Stack>
                                            <Stack direction={"row"}>
                                                <Text fontSize="lg" ml={"2vh"} width={"20vh"}>E-Mail</Text>
                                                <Text fontSize="lg">{email}</Text>
                                            </Stack>
                                            <Stack direction={"row"}>
                                                <Text fontSize="lg" ml={"2vh"} width={"20vh"}>Created at</Text>
                                                <Text fontSize="lg">{userInfo?.createdAt.match("....-..-..")}</Text>
                                            </Stack>
                                        </Stack>
                                    </WidgetCentered>
                                ) ||
                                page == "security" && (
                                    <WidgetCentered title="Security" logo={false} width="70%">

                                        <form onSubmit={formik.handleSubmit}>
                                            <Stack spacing={4}>
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
                                            </Stack>
                                        </form>
                                        <Button backgroundColor={"darkred"} onClick={handleDelete} data-cy={"deleteAccount"} mt={"1vh"}>
                                            Delete Account
                                        </Button>
                                    </WidgetCentered>
                                ) ||
                                page == "payments" && (
                                    <WidgetCentered title="Payments and Subscribtions" logo={false} width="70%">
                                    </WidgetCentered>
                                )
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </Authenticator>
        </>
    );
};

export default Account;