import { Box, Heading } from "@chakra-ui/react";
import { useApi, useUserInfo } from "@hooks/api";
import { SECURE_PONG } from "@routes/api/v1";
import { AUTH_SIGNIN, ROOT, SPACES_NEW } from "@routes/space";
import Router from "next/router";
import { useEffect } from "react";

const Spaces: React.FC = () => {
    const [api] = useApi();
    const userInfo = useUserInfo();
    useEffect(() => {
        api.get(SECURE_PONG).then((res) => {
            if (res.status == 200) {
                if (userInfo?.recentWorkspace) {
                    Router.push(ROOT + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                };
            } else {
                Router.push(AUTH_SIGNIN);
            }
        });
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
                You're getting redirected.
            </Heading>
        </Box>
    );
}

export default Spaces;
