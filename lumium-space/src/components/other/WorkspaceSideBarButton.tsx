import { Button } from "@chakra-ui/react";
import { ROOT } from "@routes/space";
import { FiLock } from "react-icons/fi";
import NextLink from 'next/link';
import { WorkspaceDTO } from "../../../types/api/v1/response/WorkspaceDTO";

interface props {
    w: WorkspaceDTO;
}
export const WorkspaceSideBarButton = ({ w }: props) => {
    const clearWorkspacePassword = () => {
        localStorage.removeItem('workspacePassword');
    };

    return (
        <Button
            width={"100%"}
            leftIcon={<FiLock />}
            bg="none"
            justifyContent={{ base: "center", md: "flex-start" }}
            as={NextLink}
            href={ROOT + w.id}
            onClick={clearWorkspacePassword}
        >{w.name}</Button>
    )
}
