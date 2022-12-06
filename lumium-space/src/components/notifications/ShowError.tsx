import { Alert, AlertIcon, AlertTitle, Text } from "@chakra-ui/react";

interface ErrorProps {
    show: boolean;
    message: string;
};

export const ShowError = ({ show, message }: ErrorProps) => {
    return (
        show ?
            <Alert status='error' width="20%" mr="1%">
                <AlertIcon />
                <AlertTitle>{message}</AlertTitle>
            </Alert>
            :
            <Text></Text>
    );
};