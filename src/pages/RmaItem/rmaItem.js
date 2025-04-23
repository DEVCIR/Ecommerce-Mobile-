import React, { useState } from 'react';
import RmaItemTable from './rmaItemTable';
import EditRmaItem from './editRmaItem';
import AddRmaItem from './addRmaItem';

const RmaItem = () => {
    const [view, setView] = useState('table');
    const [selectedRma, setSelectedRma] = useState(null);

    const handleToggleView = (viewName) => {
        setView(viewName);
    };

    const setViewToTable = () => {
        setView('table');
    };

    const handleEditRma = (rma) => {
        setSelectedRma(rma);
        setView('edit');
    };

    return (
        <div>
            {view === 'add' && <AddRmaItem
                onBackClick={() => handleToggleView('table')}
                setViewToTable={setViewToTable}
            />}

            {view === 'edit' && (
                <EditRmaItem
                    rma={selectedRma}
                    onBackClick={() => handleToggleView('table')}
                    setViewToTable={setViewToTable}
                />
            )}


            {view === 'table' && (
                <RmaItemTable
                    onAddRmasClick={() => handleToggleView('add')}
                    onEditRma={handleEditRma}
                />
            )}
        </div>
    );
}

export default RmaItem;