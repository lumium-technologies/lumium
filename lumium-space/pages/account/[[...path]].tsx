import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Spacer, Text } from "@chakra-ui/react";
import { Authenticator } from "@security";
import Router from "next/router";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";


async function onLogout() {
    await signOut();
    window.location.href = "/";
}

async function onBack() {
    Router.push("/page");
}

const Space: React.FC = () => {
    return (
        <Authenticator>
            <Flex m={["1%"]}>
                <IconButton onClick={onBack} aria-label={''} icon={<ArrowBackIcon />} >
                    Back
                </IconButton>
                <Text fontSize="2xl" ml={["1%"]} mb={["0"]} >My Account</Text>
                <Spacer />
                <Button backgroundColor={"darkred"} onClick={onLogout}>
                    Logout
                </Button>
            </Flex>
            <Flex m={["1%"]}>
                <Text fontSize="1xl" mb={["0"]} >E-Mail:</Text>
                <Text fontSize="1xl" ml={["0.5%"]} mb={["0"]} ></Text>
            </Flex>
            <Flex>
            </Flex>
        </Authenticator >
    );
};

export default Space;