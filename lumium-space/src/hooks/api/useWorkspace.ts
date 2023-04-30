import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { SECURE_WORKSPACE_WORKSPACEID_GET } from "@routes/api/v1";
import { WorkspaceDTO } from 'lumium-renderer';

export const useWorkspace = (workspaceId: any) => {
    const [workspace, setWorkspace] = useState<WorkspaceDTO>();
    const [api] = useApi();

    const refetchWorkspace: () => Promise<void | WorkspaceDTO> = async () => {
        return api.get<WorkspaceDTO>(SECURE_WORKSPACE_WORKSPACEID_GET.replace(':workspaceId', workspaceId)).then(async (res) => {
            let wrk = res.data;
            setWorkspace(wrk);
            return Promise.resolve(wrk);
        });
    };

    useEffect(() => {
        if (!workspaceId || !localStorage.getItem("workspacePassword")) return;
        api.get<WorkspaceDTO>(SECURE_WORKSPACE_WORKSPACEID_GET.replace(':workspaceId', workspaceId)).then(async (res) => {
            let wrk = res.data;
            setWorkspace(wrk);
        });
    }, [workspaceId, api]);

    return { workspace, refetchWorkspace };
};
