import React, {useEffect, useState} from "react";


export default function LatestVersion() {
    const [version, setVersion] = useState("...");

    useEffect(() => {
        fetch("https://api.npms.io/v2/package/hcs.js").then(async r => {
            const json = await r.json();
            setVersion(json['collected']['metadata']['version']);
        });
    }, []);

    return <span>{version}</span>;
}
