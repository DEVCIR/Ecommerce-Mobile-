import React, { useState } from 'react'
import CreditNoteItemTable from './CreditNoteItemTable';
import AddCreditNoteItem from './AddCreditNoteItem';
import EditCreditNoteItem from './EditCreditNoteItem';

const CreditNoteItem = () => {
    const [view, setView] = useState('table');
    const [editProductId, setEditProductId] = useState(null);

    const handleToggleView = (viewName, productId = null) => {
        setView(viewName);
        setEditProductId(productId);
    };

    const onEditCustomer = (customerId) => {
        handleToggleView('edit', customerId);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'table' && <CreditNoteItemTable onAddBuyerClick={() => handleToggleView('add')} onEditCustomer={onEditCustomer} />}
            {view === 'add' && <AddCreditNoteItem onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} onInventoryAdded={setViewToTable} />}
            {view === 'edit' && <EditCreditNoteItem customerId={editProductId} onBackClick={() => handleToggleView('table')} />}
        </div>
    )
}

export default CreditNoteItem