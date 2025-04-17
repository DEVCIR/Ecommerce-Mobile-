import React, { useState } from 'react'
import SupplierTable from './supplierTable'
import AddSupplier from './addSupplier'
import UploadSupplier from 'pages/Upload_Supplier/uploadSupplier'

const Supplier = () => {
    const [view, setView] = useState('table');
    const [editId, setEditId] = useState(null);

    const handleToggleView = (viewName, id = null) => {
        setView(viewName);
        if (id) setEditId(id);
    };

    const setViewToTable = () => {
        setView('table');
        setEditId(null);
    };

    return (
        <div>
            {view === 'add' && <AddSupplier onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
            {view === 'upload' && <UploadSupplier onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
            {view === 'table' && <SupplierTable 
                onAddSupplierClick={() => handleToggleView('add')} 
                onUploadSupplierClick={() => handleToggleView('upload')}
                onEditSupplierClick={(id) => handleToggleView('edit', id)} 
            />}
        </div>
    )
}

export default Supplier;