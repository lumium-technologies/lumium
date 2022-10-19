import Router from 'next/router';
import { useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { AUTH_SIGNIN } from '@routes/space';

export default function Auth() {
    useEffect(() => {
        Router.push(AUTH_SIGNIN);
    }, []);
    return (
        <Box textAlign="center" py={10} px={6}>
            <WarningTwoIcon boxSize={'50px'} color={'orange.300'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                You&apos;re getting redirected
            </Heading>
        </Box>
    )
}
