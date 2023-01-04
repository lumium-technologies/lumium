import { BoxProps, Image, Flex, Stack, Button, Divider, useColorModeValue } from "@chakra-ui/react";
import { ReactElement } from "react";
import { MdPayment } from "react-icons/md";
import { BsInfoCircleFill } from "react-icons/bs";
import { AiOutlineSecurityScan } from "react-icons/ai";

interface SidebarProps extends BoxProps {
    logo: string;
    backgroundColor: string;
    setPage: (bool: any) => void;
}

export const SideBar = ({ logo, backgroundColor, setPage, ...rest }: SidebarProps) => {
    return (
        <Flex
            flexDir={"column"}
            h="auto"
            minH={"100%"}
            width={"100%"}
            maxW={"320px"}
            backgroundColor={backgroundColor}
            borderRightWidth="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            {...rest}
        >
            <Flex pt="1vh" pb="1vh" maxH={"9vh"} alignItems="center" justifyContent="center">
                <Stack align={'center'} maxH="100%" maxW="100%">
                    <Image
                        src={logo}
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
            <Button leftIcon={<AiOutlineSecurityScan />} bg="none" justifyContent={{ base: "center", md: "flex-start" }} onClick={() => { setPage("security") }}>
                Security
            </Button>
            <Button leftIcon={<MdPayment />} bg="none" justifyContent={{ base: "center", md: "flex-start" }} onClick={() => { setPage("payments") }}>
                Payments and Subscriptions
            </Button>
        </Flex >
    );
};