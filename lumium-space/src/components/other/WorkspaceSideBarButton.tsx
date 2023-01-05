import { Button } from "@chakra-ui/react";
import { ROOT } from "@routes/space";
import { WorkspaceDTO } from "@types"
import { FiLock } from "react-icons/fi";
import NextLink from 'next/link';

interface props {
    w: WorkspaceDTO;
}
export const WorkspaceSideBarButton = ({ w }: props) => {
    return (
        <Button
            width={"100%"}
            leftIcon={<FiLock />}
            bg="none"
            justifyContent={{ base: "center", md: "flex-start" }}
            as={NextLink}
            href={ROOT + w.id}
        >{w.name}</Button>
    )
}