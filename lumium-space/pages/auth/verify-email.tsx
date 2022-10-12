import { InfoIcon } from "@chakra-ui/icons";
import { Box, Button, Fade, Heading, ScaleFade, Text } from "@chakra-ui/react";
import { useApi } from "@hooks/api";
import { EMAIL_VERIFY, EMAIL_VERIFY_TOKEN } from "@routes/space";
import { Authenticator } from "@security/authentication";
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
export default function VerifyEmail() {
    const [api] = useApi();
    const router = useRouter();
    const { token } = router.query;
    const [resendIsShown, setResendIsShown] = useState(true);
    if (token) {
        api.post(EMAIL_VERIFY, {
            "method": "token",
            "token": token
        }).then(() => Router.push("/workspace/new"));
    };
    useEffect(() => {
        api.get(EMAIL_VERIFY).then((promise) => promise.data).then((value) => {
            if (value.isVerified) {
                Router.push("/workspace");
            }
        }).catch(() => {
            Router.push("/auth/signin");
        });
    }, [api])
    const handleResendEmail = () => {
        api.post(EMAIL_VERIFY_TOKEN);
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