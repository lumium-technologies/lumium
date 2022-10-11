import { InfoIcon } from "@chakra-ui/icons";
import { Box, Button, Fade, Heading, ScaleFade, Text } from "@chakra-ui/react";
import { useApi } from "@hooks/api";
import { Authenticator } from "@security/authentication";
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
export default function VerifyEmail() {
    const [api] = useApi();
    const router = useRouter();
    const { token } = router.query;
    const [resendIsShown, setResendIsShown] = useState(true);
    if (token) {
        api.post("/auth/user/email/verify", {
            "method": "token",
            "token": token
        }).then(() => Router.push("/page"));
    };
    useEffect(() => {
        api.get("/auth/user/email/verify").then((promise) => promise.data).then((value) => {
            if (value.isVerified) {
                Router.push("/page");
            }
        }).catch(() => {
            Router.push("/auth/signin");
        });
    }, [api])
    const handleResendEmail = () => {
        api.post("/auth/user/email/verify/token");
        setResendIsShown(false);
    };
    return (
        <Authenticator>
            <Fade in={true}>
                <Box textAlign="center" py={10} px={6}>
                    <InfoIcon boxSize={'50px'} color={'blue.500'} />
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Verify your E-Mail
                    </Heading>
                    <Text color={'gray.500'}>
                        Check your inbox to access Lumium
                    </Text>
                    <ScaleFade initialScale={0.9} in={resendIsShown}>
                        <Button onClick={handleResendEmail}>
                            Resend E-Mail
                        </Button>
                    </ScaleFade>
                </Box>
            </Fade>
        </Authenticator>
    )
}