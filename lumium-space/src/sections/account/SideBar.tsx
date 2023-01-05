import { BoxProps, Image, Flex, Stack, Button, useColorModeValue } from "@chakra-ui/react";
import { MdPayment } from "react-icons/md";
import { BsInfoCircleFill } from "react-icons/bs";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, BORDER_DARK, BORDER_LIGHT, LOGO_DARK, LOGO_LIGHT } from "@definitions/constants";

interface SidebarProps extends BoxProps {
    setPage: (bool: any) => void;
}

export const SideBar = ({ setPage, ...rest }: SidebarProps) => {
    return (
        <Flex
            flexDir={"column"}
            h="auto"
            minH={"100%"}
            width={"100%"}
            maxW={"320px"}
            backgroundColor={useColorModeValue(BACKGROUND_LIGHT, BACKGROUND_DARK)}
            borderRightWidth="1px"
            borderRightColor={useColorModeValue(BORDER_LIGHT, BORDER_DARK)}
            {...rest}
        >
            <Flex pt="1vh" pb="1vh" maxH={"9vh"} alignItems="center" justifyContent="center">
                <Stack align={'center'} maxH="100%" maxW="100%">
                    <Image
                        src={useColorModeValue(LOGO_DARK, LOGO_LIGHT)}
                        minWidth={"70%"}
                        maxWidth={"80%"}
                        maxH={"9vh"}
                        alt="lumium logo"
                    />
                </Stack>
            </Flex>
            <Button leftIcon={<BsInfoCircleFill />} bg="none" justifyContent={{ base: "center", md: "flex-start" }} onClick={() => { setPage("personalInfo") }}>
                Personal Information
            </Button>
            <Button data-cy={'securityTab'} leftIcon={<AiOutlineSecurityScan />} bg="none" justifyContent={{ base: "center", md: "flex-start" }} onClick={() => { setPage("security") }}>
                Security
            </Button>
            <Button leftIcon={<MdPayment />} bg="none" justifyContent={{ base: "center", md: "flex-start" }} onClick={() => { setPage("payments") }}>
                Payments and Subscriptions
            </Button>
        </Flex >
    );
};
