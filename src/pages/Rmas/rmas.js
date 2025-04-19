import React, { useState } from 'react';
import RmasTable from './rmasTable';
import AddRmas from './addRmas';
import EditRmas from './editRmas';

const Rmas = () => {
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
            {view === 'add' && <AddRmas
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}

{view === 'edit' && (
                <EditRmas
                    rma={selectedRma}
                    onBackClick={() => handleToggleView('table')}
                    setViewToTable={setViewToTable}
                />
            )}


            {view === 'table' && (
                <RmasTable 
                    onAddRmasClick={() => handleToggleView('add')}
                    onEditRma={handleEditRma}
                />
            )}
        </div>
    );
}

export default Rmas;