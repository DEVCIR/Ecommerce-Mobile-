import React, { useState } from 'react';
import ExpenseCategoryTable from './expenseCategoryTable';
import AddExpenseCategory from './addExpenseCategory';
import EditExpenseCategory from './editExpenseCategory';

const ExpenseCategory = () => {
    const [view, setView] = useState('table');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleToggleView = (viewName, category = null) => {
        setView(viewName);
        if (category) {
            setSelectedCategory(category);
        }
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddExpenseCategory 
                onBackClick={() => handleToggleView('table')} 
                setViewToTable={setViewToTable} 
            />}
            {view === 'edit' && <EditExpenseCategory 
                onBackClick={() => handleToggleView('table')}
                category={selectedCategory}
            />}
            {view === 'table' && <ExpenseCategoryTable 
                onAddExpenseCategoryClick={() => handleToggleView('add')} 
                onEditCategoryClick={(category) => handleToggleView('edit', category)}
            />}
        </div>
    );
}

export default ExpenseCategory;