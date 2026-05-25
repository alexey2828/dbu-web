import React from 'react';
import ComponentsGraphWidget from "./componentsGraphWidget";



const ComponentAnalysisPage = () => {

    return (
        <div className = 'grid grid-cols-2 gap-3 w-full p-2'>
            <ComponentsGraphWidget title={'Графiк 1'}/>
            <ComponentsGraphWidget title={'Графiк 2'}/>
            <ComponentsGraphWidget title={'Графiк 3'}/>
            <ComponentsGraphWidget title={'Графiк 4'}/>
        </div>
    )
};

export default ComponentAnalysisPage;