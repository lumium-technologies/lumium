import { Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { PageTitle, WidgetCentered } from "@components/other";
import { Authenticator } from "@components/security/Authenticator";
import { BACKGROUND_LIGHT, BACKGROUND_DARK } from "@definitions/constants";
// import { useApi, useUserInfo } from "@hooks/api";
// import { SECURE_USER_DELETE } from "@routes/api/v1";
// import { ROOT } from "@routes/space";
import { NavBar, SideBar } from "@sections/account";
import Router from "next/router";
import { useEffect, useState } from "react";

const Account: React.FC = () => {
    const backgroundColor = useColorModeValue(BACKGROUND_LIGHT, BACKGROUND_DARK);

    // const [api] = useApi();
    const [email, setEmail] = useState("");
    const [page, setPage] = useState("personalInfo");
    // const { userInfo } = useUserInfo();
    const handleDelete = () => {
        // api.delete(SECURE_USER_DELETE).then(() => Router.push(ROOT));
    };
    // useEffect(() => {
    //     userInfo?.emails.map((e) => {
    //         if (e.primary) {
    //             setEmail(e.email);
    //         }
    //     });
    // }, [userInfo])
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
                                    <WidgetCentered title="Personal Information" logo={false} width="70%">
                                        <Stack direction={"row"}>
                                            <Text fontSize="sm" width={"10vh"}>Username</Text>
                                            <Text fontSize="sm" >{/*userInfo?.nickName*/}</Text>
                                        </Stack>
                                        <Stack direction={"row"}>
                                            <Text fontSize="sm" width={"10vh"}>E-Mail</Text>
                                            <Text fontSize="sm">{email}</Text>
                                        </Stack>
                                    </WidgetCentered>
                                ) ||
                                page == "security" && (
                                    <WidgetCentered title="Security" logo={false} width="70%">
                                        <Button backgroundColor={"darkred"} onClick={handleDelete} data-cy={"deleteAccount"}>
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
