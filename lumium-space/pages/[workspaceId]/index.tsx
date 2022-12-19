import { useWorkspace } from "@hooks/api";
import { useRouter } from "next/router";

const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId } = router.query;
    const workspace = useWorkspace(workspaceId);

    return <p>{JSON.stringify(workspace)}</p>;
};

export default Workspace;
