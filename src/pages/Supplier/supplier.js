import React, { useState } from 'react'
import SupplierTable from './supplierTable'
import AddSupplier from './addSupplier'
import UploadSupplier from 'pages/Upload_Supplier/uploadSupplier'
import EditSupplier from './editSupplier'


const Supplier = () => {
    const [view, setView] = useState('table');
    const [editId, setEditId] = useState(null);
    const [key, setKey] = useState(0);

    const handleToggleView = (viewName, id = null) => {
        setView(viewName);
        if (id) {
            setEditId(id);
        } else {
            setEditId(null);
        }
        // Increment key to force remount when switching to edit view
        if (viewName === 'edit') {
            setKey(prev => prev + 1);
        }
    };

    const setViewToTable = () => {
        setView('table');
        setEditId(null);
    };

    return (

        // <div>
        //     {view === 'add' && <AddSupplier onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
        //     {view === 'upload' && <UploadSupplier onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
        //     {view === 'edit' && <EditSupplier 
        //         onBackClick={() => handleToggleView('table')} 
        //         setViewToTable={setViewToTable}
        //         supplierId={editId}
        //     />}
        //     {view === 'table' && <SupplierTable 
        //         onAddSupplierClick={() => handleToggleView('add')} 
        //         onUploadSupplierClick={() => handleToggleView('upload')}
        //         onEditSupplierClick={(id) => handleToggleView('edit', id)} 
        //     />}
        // </div>

        <div>
            {view === 'add' && (
                <AddSupplier 
                    onBackClick={() => handleToggleView('table')} 
                    setViewToTable={setViewToTable} 
                />
            )}
            
            {view === 'upload' && (
                <UploadSupplier 
                    onBackClick={() => handleToggleView('table')} 
                    setViewToTable={setViewToTable} 
                />
            )}
            
            {view === 'edit' && (
                <EditSupplier 
                    key={key} // Force remount when editId changes
                    onBackClick={() => handleToggleView('table')} 
                    setViewToTable={setViewToTable}
                    supplierId={editId}
                />
            )}
            
            {view === 'table' && (
                <SupplierTable 
                    onAddSupplierClick={() => handleToggleView('add')} 
                    onUploadSupplierClick={() => handleToggleView('upload')}
                    onEditSupplierClick={(id) => handleToggleView('edit', id)} 
                />
            )}
        </div>
    )
}

export default Supplier;