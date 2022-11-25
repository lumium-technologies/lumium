import { SECURE_USER_GET } from '@routes/api/v1';
import { UserDTO, WorkspaceDTO } from "@types";
import Router from 'next/router';
import { useState } from 'react';
import { useApi } from '@hooks/api';
import { SPACES_NEW } from '@routes/space';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserDTO>();
    const [api] = useApi();
    api.get<UserDTO>(SECURE_USER_GET).then((res) => {
        setUserInfo(res.data);
    });
    return userInfo;
}