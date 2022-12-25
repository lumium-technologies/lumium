import { LumiumRenderer } from "@components/rendering";
import { Flex, Textarea } from "@chakra-ui/react";

const Page: React.FC = () => {
    return (
        <Flex flexDir={"row"}>
            <Textarea placeholder="page markdown here" />
            <LumiumRenderer />
        </Flex>
    );
};

export default Page;
