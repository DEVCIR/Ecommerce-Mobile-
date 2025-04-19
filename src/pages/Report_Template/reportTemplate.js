import React, { useState } from 'react'
import ReportTemplateTable from './reportTemplateTable'
import AddReportTemplate from './addReportTemplate'
import EditReportTemplate from './editReportTemplate'

export default function ReportTemplate() {
    const [view, setView] = useState('table')
    const [currentTemplate, setCurrentTemplate] = useState(null)

    const handleAddView = () => {
        setCurrentTemplate(null)
        setView('add')
    }

    const handleEditTemplate = (template) => {
        setCurrentTemplate(template)
        setView('edit')
    }

    return (
        <div>
            {view === 'add' && (
                <AddReportTemplate
                    onBackClick={() => setView('table')}
                />
            )}
            {view === 'edit' && currentTemplate && (
                <EditReportTemplate
                    template={currentTemplate}
                    onBackClick={() => setView('table')}
                />
            )}
            {view === 'table' && (
                <ReportTemplateTable 
                    onAddTemplateClick={handleAddView}
                    onEditTemplateClick={handleEditTemplate}
                />
            )}
        </div>
    )
}