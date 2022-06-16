import { render_page } from 'lumium-renderer';
import { useEffect } from 'react';

export const LumiumRenderer = () => {
    useEffect(() => {
        render_page();
    }, []);
    return <article id='page-canvas' />;
};
