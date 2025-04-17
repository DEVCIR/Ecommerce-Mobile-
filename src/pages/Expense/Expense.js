import React, { useState } from 'react'
import ExpenseTable from './ExpenseTable';
import AddExpense from './AddExpense';
import EditExpense from './EditExpense';

const Expense = () => {
    const [view, setView] = useState('table');
    const [editProductId, setEditProductId] = useState(null);

    const handleToggleView = (viewName, productId = null) => {
        setView(viewName);
        setEditProductId(productId);
    };

    const onEditCustomer = (customerId) => {
        handleToggleView('edit', customerId);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'table' && <ExpenseTable onAddBuyerClick={() => handleToggleView('add')} onEditCustomer={onEditCustomer} />}
            {view === 'add' && <AddExpense onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} onInventoryAdded={setViewToTable} />}
            {view === 'edit' && <EditExpense customerId={editProductId} onBackClick={() => handleToggleView('table')} />}
        </div>
    )
}

export default Expense