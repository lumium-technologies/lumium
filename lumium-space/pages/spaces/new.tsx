import { useEffect } from "react";
import { generate_workspace_key_with_recovery } from "lumium-renderer";

export default function NewWorkspace() {
    useEffect(() => {
        generate_workspace_key_with_recovery('dummy_password');
    });
    return null;
}
