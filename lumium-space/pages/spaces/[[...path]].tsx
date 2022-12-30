import { useUserInfo } from "@hooks/api";
import { ROOT, SPACES_OVERVIEW } from "@routes/space";
import Router from "next/router";
import { useEffect } from "react";

const Spaces: React.FC = () => {
    const { refetchUserInfo } = useUserInfo();

    useEffect(() => {
        refetchUserInfo().then((info) => {
            if (info?.recentWorkspace) {
                Router.push(ROOT + info?.recentWorkspace.id);
            } else {
                Router.push(SPACES_OVERVIEW);
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default Spaces;
