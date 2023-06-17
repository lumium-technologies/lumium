import { Flex, Stack, Heading, Box, Image, Link, Center, useColorModeValue } from "@chakra-ui/react"
import { LOGO_DARK, LOGO_LIGHT } from "@definitions/constants";
// import { ROOT } from "@routes/space";
import NextLink from 'next/link';

interface WidgetCenteredProps {
    title: string;
    children: React.ReactNode;
    logo?: boolean;
    width?: string;
    height?: string;
}

export const WidgetCentered = ({ title, children, logo = true, width = "xl", height = "100vh" }: WidgetCenteredProps) => {
    const logoImg = useColorModeValue(LOGO_DARK, LOGO_LIGHT);
    return (
        <Flex
            minH={height}
            flexDir="column"
        >
            <Stack
                spacing={8}
                mx={'auto'}
                maxW={width}
                py={"3%"}
                px={"2%"}
                width="100%"
            >
                {
                    logo &&
                    <Stack align={'center'}>
                        <Link as={NextLink} href={""/*ROOT*/}>
                            <Center>
                                <Image src={logoImg} minWidth={"70%"} maxWidth={"80%"} alt="lumium logo" />
                            </Center>
                        </Link>
                    </Stack>
                }
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        {title}
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    boxShadow={'lg'}
                    p={"10%"}
                    backgroundColor={useColorModeValue("#FAFAFA", "#222222")}
                >
                    {children}
                </Box>
            </Stack >
        </Flex>
    )
};

