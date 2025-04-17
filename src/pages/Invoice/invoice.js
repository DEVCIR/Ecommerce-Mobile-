import React, { useState } from 'react';
import InvoiceTable from './InvoiceTable';
import AddInvoice from './addInvoice';


const Invoice = () => {
    const [view, setView] = useState('table');


    const handleToggleView = (viewName) => {
        setView(viewName);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddInvoice onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
            {view === 'table' && <InvoiceTable onAddInvoiceClick={() => handleToggleView('add')} onEditInvoiceClick={(id) => handleToggleView('edit', id)} />}
        </div>
    );
};

export default Invoice;