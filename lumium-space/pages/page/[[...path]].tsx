import { Authenticator } from "@security";
import { LumiumRenderer } from "@components";
import { TopDrawerMenu } from "@components/menu";
import { Box } from '@chakra-ui/react'
const Space: React.FC = () => {
    return (
        <Authenticator>
            <TopDrawerMenu />
            <Box p={["1%"]}>
                <LumiumRenderer />
            </Box>
        </Authenticator>
    );
};

export default Space;
