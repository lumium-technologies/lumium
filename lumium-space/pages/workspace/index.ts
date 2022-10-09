import { useApi } from "@hooks/api"
import { useEffect, useState } from "react";
import { UserDTO, WorkspaceDTO } from "@types";
import Router from "next/router";

const Workspace: React.FC = () => {
    const [api] = useApi();
    const [recentWorkspace, setRecentWorkspace] = useState<WorkspaceDTO>();

    useEffect(() => {
        api.get<UserDTO>('/secure/user').then((res) => {
            setRecentWorkspace(res.data.recentWorkspace);
            if (recentWorkspace) {
                Router.push('/' + recentWorkspace.id);
            } else {
                Router.push('/spaces/new');
            }
        });
    });

    return null;
}

export default Workspace;
