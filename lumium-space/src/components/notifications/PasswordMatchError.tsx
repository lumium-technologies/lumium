import { Alert, AlertIcon, AlertTitle, Text } from "@chakra-ui/react"

export const PasswordMatchError = (check: boolean) => {
    return (
        check ?
            <Alert status='error' width="20%" mr="1%">
                <AlertIcon />
                <AlertTitle>Passwords don't match</AlertTitle>
            </Alert>
            :
            <Text></Text>
    )
}