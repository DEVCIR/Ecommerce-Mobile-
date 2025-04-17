import React, { useState } from 'react';
import OrderTable from './ordersTable';
import AddOrder from './addOrders';


const Order = () => {
    const [view, setView] = useState('table');

    const handleToggleView = (viewName, orderId = null) => {
        setView(viewName);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddOrder onBackClick={() => handleToggleView('table')} />}
            {view === 'table' && <OrderTable onAddOrderClick={() => handleToggleView('add')} />}
        </div>
    );
};

export default Order;