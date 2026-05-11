import React from "react";
import GraphWidget from "./GraphWidget"

export default function ProductionAnalysisPage() {
return(
    <>
        <div className="grid grid-cols-2 gap-3 w-full p-2">

            <GraphWidget title="Графік 1" />
            <GraphWidget title="Графік 2" />
            <GraphWidget title="Графік 3" />
            <GraphWidget title="Графік 4" />

        </div>
    </>)

}