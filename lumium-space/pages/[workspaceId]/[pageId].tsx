import { usePage } from "@hooks/api";
import { useRouter } from "next/router";

const Page: React.FC = () => {
    const router = useRouter();
    const { pageId } = router.query;
    const page = usePage(pageId);

    return <p>{JSON.stringify(page)}</p>;
};

export default Page;
