import React, {useEffect, useState} from "react";


export default function LatestVersion() {
    const [version, setVersion] = useState("...");

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kimcore/hcs.js/main/package.json").then(async r => {
            const json = await r.json();
            setVersion(json['version']);
        });
    }, []);

    return <span>{version}</span>;
}
