import React, { useState } from 'react';
import DeliveryNoteTable from './deliveryNoteTable';
import AddDeliveryNote from './addDeliveryNote';

const DeliveryNote = () => {
    const [view, setView] = useState('table');

    const handleToggleView = (viewName) => {
        setView(viewName);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddDeliveryNote 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'table' && <DeliveryNoteTable 
                onAddDeliveryNoteClick={() => handleToggleView('add')} 
            />}
        </div>
    );
}

export default DeliveryNote;