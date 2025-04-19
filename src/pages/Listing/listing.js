import React, { useState } from 'react'
import ListingTable from './listingTable';
import AddListing from './addListing';
import EditListing from './editListing';

const Listing = () => {
    const [view, setView] = useState('table');
    const [editListingId, setEditListingId] = useState(null);

    const handleToggleView = (viewName, listingId = null) => {
        setView(viewName);
        setEditListingId(listingId);
    };

    const onEditListing = (listingId) => {
        handleToggleView('edit', listingId);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'table' && <ListingTable onAddListingClick={() => handleToggleView('add')} onEditListing={onEditListing} />}
            {view === 'add' && <AddListing onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} onAddListingClick={setViewToTable} />}
            {view === 'edit' && <EditListing listingId={editListingId}  onBackClick={() => handleToggleView('table')} />}
        </div>
    )
}

export default Listing;