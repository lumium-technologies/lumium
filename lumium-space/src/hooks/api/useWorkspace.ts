import { useEffect, useState } from "react";
import { WorkspaceDTO } from "@types";
import { useApi } from "./useApi";
import { SECURE_WORKSPACE_WORKSPACEID_GET } from "@routes/api/v1";

export const useWorkspace = (workspaceId: any) => {
    const [workspace, setWorkspace] = useState<WorkspaceDTO>();
    const [api] = useApi();

    useEffect(() => {
        if (!workspaceId) return;
        api.get<WorkspaceDTO>(SECURE_WORKSPACE_WORKSPACEID_GET.replace(':workspaceId', workspaceId)).then((res) => {
            setWorkspace(res.data);
        });
    }, [workspaceId, api]);

    return workspace;
};
