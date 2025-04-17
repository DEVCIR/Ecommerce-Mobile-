import React, { useState } from 'react';
import EmailCampaignTable from './emailCampaignTable';
import AddEmailCampaign from './addEmailCampaign';
import EditEmailCampaign from './editEmailCampaign';

const EmailCampaign = () => {
    const [view, setView] = useState('table');
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const handleToggleView = (viewName, campaign = null) => {
        setView(viewName);
        if (campaign) {
            setSelectedCampaign(campaign);
        }
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddEmailCampaign 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'edit' && <EditEmailCampaign 
                onBackClick={() => handleToggleView('table')}
                campaign={selectedCampaign}
            />}
            {view === 'table' && <EmailCampaignTable 
                onAddEmailCampaignClick={() => handleToggleView('add')} 
                onEditCampaignClick={(campaign) => handleToggleView('edit', campaign)}
            />}
        </div>
    );
}

export default EmailCampaign;