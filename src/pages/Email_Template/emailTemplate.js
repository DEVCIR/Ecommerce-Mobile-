import React, { useState } from 'react';
import EmailTemplateTable from './emailTemplateTable';
import AddEmailTemplate from './addEmailTemplate';
import EditEmailTemplate from './editEmailTemplate';

const EmailTemplate = () => {
    const [view, setView] = useState('table');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const handleToggleView = (viewName, template = null) => {
        setView(viewName);
        if (template) {
            setSelectedTemplate(template);
        }
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddEmailTemplate 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'edit' && <EditEmailTemplate 
                onBackClick={() => handleToggleView('table')}
                template={selectedTemplate}
            />}
            {view === 'table' && <EmailTemplateTable 
                onAddEmailTemplateClick={() => handleToggleView('add')} 
                onEditTemplateClick={(template) => handleToggleView('edit', template)}
            />}
        </div>
    );
}

export default EmailTemplate;