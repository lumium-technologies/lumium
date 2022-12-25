import { useEffect, useState } from "react";
import { PageDTO } from "@types";
import { useApi } from "./useApi";
import { SECURE_PAGE_PAGEID_GET } from "@routes/api/v1";

export const usePage = (pageId: any) => {
    const [page, setPage] = useState<PageDTO>();
    const [api] = useApi();

    useEffect(() => {
        if (!pageId) return;
        api.get<PageDTO>(SECURE_PAGE_PAGEID_GET.replace(':pageId', pageId)).then((res) => {
            setPage(res.data);
        });
    }, [pageId, api]);

    return page;
};
