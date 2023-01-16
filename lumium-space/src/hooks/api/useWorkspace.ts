import { useEffect, useState } from "react";
import { WorkspaceDTO } from "../../../types/api/v1/response/WorkspaceDTO";
import { useApi } from "./useApi";
import { SECURE_WORKSPACE_WORKSPACEID_GET } from "@routes/api/v1";
import { dec } from 'lumium-renderer';

export const useWorkspace = (workspaceId: any) => {
    const [workspace, setWorkspace] = useState<WorkspaceDTO>();
    const [api] = useApi();

    const refetchWorkspace: () => Promise<void | WorkspaceDTO> = async () => {
        return api.get<WorkspaceDTO>(SECURE_WORKSPACE_WORKSPACEID_GET.replace(':workspaceId', workspaceId)).then(async (res) => {
            let wrk = res.data;
            wrk.name = await dec(wrk?.name);
            setWorkspace(wrk);
            return Promise.resolve(wrk);
        });
    };

    useEffect(() => {
        if (!workspaceId || !localStorage.getItem(workspaceId)) return;
        api.get<WorkspaceDTO>(SECURE_WORKSPACE_WORKSPACEID_GET.replace(':workspaceId', workspaceId)).then(async (res) => {
            let wrk = res.data;
            wrk.name = await dec(wrk?.name);
            setWorkspace(wrk);
        });
    }, [workspaceId, api]);

    return { workspace, refetchWorkspace };
};
