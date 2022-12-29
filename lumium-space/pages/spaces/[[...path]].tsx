import { useApi, useUserInfo } from "@hooks/api";
import { SECURE_PONG } from "@routes/api/v1";
import { AUTH_SIGNIN, ROOT, SPACES_NEW } from "@routes/space";
import Router from "next/router";
import { useEffect } from "react";

const Spaces: React.FC = () => {
    const [api] = useApi();
    const { refetchUserInfo } = useUserInfo();

    useEffect(() => {
        api.get(SECURE_PONG).then((res) => {
            if (res.status == 200) {
                refetchUserInfo().then((info) => {
                    if (info?.recentWorkspace) {
                        Router.push(ROOT + info?.recentWorkspace.id);
                    } else {
                        Router.push(SPACES_NEW);
                    };
                });
            } else {
                Router.push(AUTH_SIGNIN);
            }
        });
    }, []);

    return null;
}

export default Spaces;
