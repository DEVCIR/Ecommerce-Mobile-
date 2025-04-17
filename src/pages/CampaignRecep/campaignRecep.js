import React, { useState } from 'react';
import CampaignRecepTable from './campaignRecepTable';
import AddCampaignRecep from './addCampaignRecep';
import EditCampaignRecep from './editCampaignRecep';

const CampaignRecep = () => {
    const [view, setView] = useState('table');
    const [selectedRecep, setSelectedRecep] = useState(null);

    const handleToggleView = (viewName, recep = null) => {
        setView(viewName);
        if (recep) {
            setSelectedRecep(recep);
        }
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddCampaignRecep 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'edit' && <EditCampaignRecep 
                onBackClick={() => handleToggleView('table')}
                recep={selectedRecep}
            />}
            {view === 'table' && <CampaignRecepTable 
                onAddCampaignRecepClick={() => handleToggleView('add')} 
                onEditRecepClick={(recep) => handleToggleView('edit', recep)}
            />}
        </div>
    );
}

export default CampaignRecep;

