import React, { useState } from 'react';
import DeliveryNoteTable from './deliveryNoteTable';
import AddDeliveryNote from './addDeliveryNote';
import EditDeliveryNote from './editDeliveryNote';

const DeliveryNote = () => {
    const [view, setView] = useState('table');
    const [selectedNote, setSelectedNote] = useState(null);

    const handleToggleView = (viewName) => {
        setView(viewName);
    };

    const setViewToTable = () => {
        setView('table');
    };

    const handleEditNote = (note) => {
        setSelectedNote(note);
        setView('edit');
    };

    return (
        <div>
            {view === 'add' && <AddDeliveryNote 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'edit' && (
                <EditDeliveryNote 
                    note={selectedNote}
                    onBackClick={() => handleToggleView('table')} 
                    setViewToTable={setViewToTable} 
                />
            )}
            {view === 'table' && (
                <DeliveryNoteTable 
                    onAddDeliveryNoteClick={() => handleToggleView('add')}
                    onEditNoteClick={handleEditNote}
                />
            )}
        </div>
    );
}

export default DeliveryNote;