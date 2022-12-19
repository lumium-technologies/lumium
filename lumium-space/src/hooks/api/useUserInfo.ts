import { SECURE_USER_GET } from '@routes/api/v1';
import { UserDTO } from "@types";
import { useEffect, useState } from 'react';
import { useApi } from '@hooks/api';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserDTO>();

    const [api] = useApi();

    const refetchUserInfo: () => Promise<void | UserDTO> = async () => {
        return api.get<UserDTO>(SECURE_USER_GET).then((res) => {
            setUserInfo(res.data);
            return Promise.resolve(res.data);
        });
    };

    useEffect(() => {
        api.get<UserDTO>(SECURE_USER_GET).then((res) => {
            setUserInfo(res.data);
        });
    }, [api]);

    return { userInfo, refetchUserInfo };
}
