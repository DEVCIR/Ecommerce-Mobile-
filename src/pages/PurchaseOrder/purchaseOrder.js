import React, { useState } from 'react';
import PurchaseOrderTable from './purchaseOrderTable';
import AddPurchaseOrder from './addPurchaseOrder';

const PurchaseOrder = () => {
    const [view, setView] = useState('table');

    const handleToggleView = (viewName) => {
        setView(viewName);;
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddPurchaseOrder onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
            {view === 'table' && <PurchaseOrderTable 
                onAddPurchaseOrderClick={() => handleToggleView('add')} 
            />}
        </div>
    )
}

export default PurchaseOrder;