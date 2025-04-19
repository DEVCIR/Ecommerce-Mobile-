import React, { useState } from 'react'
import BuyersTable from './buyersTable'
import AddBuyers from './addBuyers';
import EditBuyers from './editBuyers';


const Buyers = () => {
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
            {view === 'table' && <BuyersTable onAddBuyerClick={() => handleToggleView('add')} onEditCustomer={onEditCustomer} />}
            {view === 'add' && <AddBuyers onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} onInventoryAdded={setViewToTable} />}
            {view === 'edit' && <EditBuyers customerId={editProductId} onBackClick={() => handleToggleView('table')} />}
        </div>
    )
}

export default Buyers
