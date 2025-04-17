import React, { useState } from 'react'
import InventoryTable from './inventoryTable'
import AddInventory from './addInventory'
import EditInventory from './editInventory'

const Inventory = () => {
    const [view, setView] = useState('table');
    const [editProductId, setEditProductId] = useState(null);

    const handleToggleView = (viewName, productId = null) => {
        setView(viewName);
        setEditProductId(productId);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddInventory onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} onInventoryAdded={setViewToTable} />}
            {view === 'edit' && <EditInventory productId={editProductId} onBackClick={() => handleToggleView('table')} />}
            {view === 'table' && <InventoryTable onAddProductClick={() => handleToggleView('add')} onEditProductClick={(id) => handleToggleView('edit', id)} />}
        </div>
    )
}

export default Inventory
