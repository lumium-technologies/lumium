import axios from 'axios';
import { render_markdown, render_page } from 'lumium-renderer';
import { useEffect, useState, CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';

export const LumiumRenderer = () => {
    //const [page, setPage] = useState<string>("");

    useEffect(() => {
        //axios.get("https://raw.githubusercontent.com/D3PSI/cs-wiki/master/markdown/Formulary%20%26%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17.md").then((res) => {
        //setPage(render_markdown(res.data));
        render_page();
        //});
    }, []);
    //return <div dangerouslySetInnerHTML={{__html: page}} />;
    return null;
};
