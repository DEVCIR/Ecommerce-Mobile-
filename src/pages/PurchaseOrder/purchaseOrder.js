import React, { useState } from 'react';
import PurchaseOrderTable from './purchaseOrderTable';
import AddPurchaseOrder from './addPurchaseOrder';
import OrderUpload from './orderUpload';
import PurchaseOrderTemplate from './purchaseOrderTemplate';

const PurchaseOrder = () => {
    const [view, setView] = useState('table');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleToggleView = (viewName) => {
        setView(viewName);
    };

    const setViewToTable = () => {
        setView('table');
        setSelectedOrder(null);
    };

    return (
        <div>
            {selectedOrder ? (
                <PurchaseOrderTemplate order={selectedOrder} onBackClick={setViewToTable} />
            ) : (
                <>
                    {view === 'add' && <AddPurchaseOrder onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
                    {view === 'table' && <PurchaseOrderTable onAddPurchaseOrderClick={() => handleToggleView('add')} onUploadProductOrder={() => handleToggleView('upload')} onSelectOrder={setSelectedOrder} />}
                    {view === 'upload' && <OrderUpload onBackClick={() => handleToggleView('table')} />}
                </>
            )}
        </div>
    );
}

export default PurchaseOrder;