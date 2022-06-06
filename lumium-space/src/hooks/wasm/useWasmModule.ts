import { useEffect, useState } from "react";

export const useWasmModule = (moduleName: string) : any | null => {
    const [wasm, setWasm] = useState<any>(null);
    useEffect(() => {
        const fetchWasm = async () => {
            const res = await fetch("wasm/" + moduleName);
            const buffer = await res.arrayBuffer();
            setWasm(await WebAssembly.instantiate(buffer, {}));
        };
        fetchWasm();
    }, [moduleName]);
    return wasm;
}
