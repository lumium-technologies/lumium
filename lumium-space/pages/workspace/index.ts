import { useApi } from "@hooks/api"
import { useEffect, useState } from "react";
import { UserDTO, WorkspaceDTO } from "@types";
import Router from "next/router";
import { SECURE_USER_GET } from "@routes/api/v1";
import { LANDING_PAGE, SPACES_NEW } from "@routes/space";

const Workspace: React.FC = () => {
    const [api] = useApi();
    const [recentWorkspace, setRecentWorkspace] = useState<WorkspaceDTO>();

    useEffect(() => {
        api.get<UserDTO>(SECURE_USER_GET).then((res) => {
            setRecentWorkspace(res.data.recentWorkspace);
            if (recentWorkspace) {
                Router.push(LANDING_PAGE + '/' + recentWorkspace.id);
            } else {
                Router.push(SPACES_NEW);
            }
        });
    });

    return null;
}

export default Workspace;
