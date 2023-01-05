import { Box, Heading, Text } from "@chakra-ui/react";
import { AUTH_SIGNIN } from "@routes/space";
import Router from "next/router";
import { useEffect } from "react";

const Auth: React.FC = () => {
    useEffect(() => {
        Router.push(AUTH_SIGNIN);
    });

    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                bgGradient="linear(to-r, teal.400, teal.600)"
                backgroundClip="text"
            >
                404
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                Page Not Found
            </Text>
            <Text color={'gray.500'} mb={6}>
                The page you&apos;re looking for does not seem to exist
            </Text>
        </Box>
    );
}

export default Auth;
