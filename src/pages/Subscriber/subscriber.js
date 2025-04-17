import React, { useState } from 'react'
import SubscriberTable from './subscriberTable'
import AddSubscriber from './addSubscriber'
import EditSubscriber from './editSubscriber'

const Subscriber = () => {
    const [view, setView] = useState('table');
    const [editSubscriberId, setEditSubscriberId] = useState(null);

    const handleToggleView = (viewName, subscriberId = null) => {
        setView(viewName);
        setEditSubscriberId(subscriberId);
    };

    const setViewToTable = () => {
        setView('table');
    };

    return (
        <div>
            {view === 'add' && <AddSubscriber onBackClick={() => handleToggleView('table')} setViewToTable={setViewToTable} />}
            {view === 'edit' && <EditSubscriber subscriberId={editSubscriberId} onBackClick={() => handleToggleView('table')} />}
            {view === 'table' && <SubscriberTable onAddSubscriberClick={() => handleToggleView('add')} onEditSubscriberClick={(id) => handleToggleView('edit', id)} />}
        </div>
    )
}

export default Subscriber