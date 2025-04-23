import React, { useState } from 'react'
import VouchersTable from './vouchersTable';
import AddVoucher from './addVouchers';

const Vouchers = () => {
    const [view, setView] = useState('table');

    const handleToggleView = (viewName) => {
        setView(viewName);
    };

    return (
        <div>
            {view === 'table' && (
                <VouchersTable 
                    onAddVoucherClick={() => handleToggleView('add')} 
                />
            )}
            {view === 'add' && (
                <AddVoucher 
                    onBackClick={() => handleToggleView('table')}
                    onAddVoucherClick={() => handleToggleView('table')} 
                />
            )}
        </div>
    )
}

export default Vouchers;