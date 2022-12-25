import { render_page } from "lumium-renderer";
import React, { useEffect } from "react";

const LumiumRenderer: React.FC = () => {
    useEffect(render_page, []);
    return <div id="page-canvas" />;
};

export { LumiumRenderer };
