import { Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { PageTitle } from "@components/other";
import { Authenticator } from "@components/security/Authenticator";
import { BACKGROUND_LIGHT, BACKGROUND_DARK } from "@definitions/constants";
import { useApi, useUserInfo } from "@hooks/api";
import { SECURE_USER_DELETE } from "@routes/api/v1";
import { ROOT } from "@routes/space";
import { NavBar, SideBar } from "@sections/account";
import Router from "next/router";
import { useEffect, useState } from "react";

const Account: React.FC = () => {
    const backgroundColor = useColorModeValue(BACKGROUND_LIGHT, BACKGROUND_DARK);

    const [api] = useApi();
    const [email, setEmail] = useState("");
    const [page, setPage] = useState("personalInfo");
    const { userInfo } = useUserInfo();
    const handleDelete = () => {
        api.delete(SECURE_USER_DELETE).then(() => Router.push(ROOT));
    };
    useEffect(() => {
        userInfo?.emails.map((e) => {
            if (e.primary) {
                setEmail(e.email);
            }
        });
    }, [userInfo])
    return (
        <>
            <PageTitle title={"Lumium | Account"} />
            <Authenticator>
                <Flex width={"100%"} minHeight={"100vh"} flexDirection={"row"}>
                    <SideBar
                        backgroundColor={backgroundColor}
                        setPage={setPage}
                    />
                    <Flex width={"100%"} flexDirection={"column"} >
                        <NavBar backgroundColor={backgroundColor} />
                        <Flex flexDirection={"column"} alignContent={"center"} height={"100%"} ml={"1vh"}>
                            {
                                page == "personalInfo" && (
                                    <>
                                        <Heading>Personal Information</Heading>
                                        <Flex flexDirection={"column"}>
                                            <Stack direction={"row"}>
                                                <Text fontSize="sm" width={"10vh"}>Username</Text>
                                                <Text fontSize="sm" >{userInfo?.nickName}</Text>
                                            </Stack>
                                            <Stack direction={"row"}>
                                                <Text fontSize="sm" width={"10vh"}>E-Mail</Text>
                                                <Text fontSize="sm">{email}</Text>
                                            </Stack>
                                        </Flex>
                                    </>
                                ) ||
                                page == "security" && (
                                    <>
                                        <Heading>Security</Heading>
                                        <Flex>
                                            <Button backgroundColor={"darkred"} onClick={handleDelete} data-cy={"deleteAccount"}>
                                                Delete Account
                                            </Button>
                                        </Flex>
                                    </>
                                ) ||
                                page == "payments" && (
                                    <>
                                        <Heading>Payments and Subscribtions</Heading>
                                        <Flex>

                                        </Flex>
                                    </>
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
