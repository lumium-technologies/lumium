import axios from 'axios';
import { render_markdown } from 'lumium-renderer';
import { useEffect } from 'react';

export const LumiumRenderer = () => {
    useEffect(() => {
        axios.get("https://raw.githubusercontent.com/D3PSI/cs-wiki/master/markdown/Formulary%20%26%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17.md").then((res) => {
            render_markdown(res.data);
        });
    }, []);
    return null;
};
