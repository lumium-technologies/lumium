import axios from 'axios';
import { render_markdown } from 'lumium-renderer';
import { useEffect, useState } from 'react';

export const LumiumRenderer = () => {
    const [page, setPage] = useState<string>("");

    useEffect(() => {
        axios.get("https://raw.githubusercontent.com/D3PSI/cs-wiki/master/markdown/Formulary%20%26%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17.md").then((res) => {
            setPage(render_markdown(res.data));
        });
    }, []);
    return <div dangerouslySetInnerHTML={{__html: page}} />;
};
