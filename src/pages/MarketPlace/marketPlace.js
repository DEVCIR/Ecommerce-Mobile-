import React, { useState } from 'react';
import MarketplaceTable from './marketPlaceTable';
import AddMarketplaceItem from './addMarketPlace';
import EditMarketplaceItem from './editMarketPlace';

const Marketplace = () => {
    const [view, setView] = useState('table');
    const [selectedItem, setSelectedItem] = useState(null);
    

    const handleToggleView = (viewName, item = null) => {
        setView(viewName);
        if (item) {
            setSelectedItem(item);
        }
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddMarketplaceItem 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'edit' && <EditMarketplaceItem 
                onBackClick={() => handleToggleView('table')}
                item={selectedItem}
            />}
            {view === 'table' && <MarketplaceTable 
                onAddItemClick={() => handleToggleView('add')} 
                onEditItemClick={(item) => handleToggleView('edit', item)}
            />}
        </div>
    );
}

export default Marketplace;
