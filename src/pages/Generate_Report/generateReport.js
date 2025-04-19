import React, { useState } from 'react'
import GenerateReportTable from './generateReportTable'
import AddGenerateReport from './addGenerateReport'
import EditGenerateReport from './editGenerateReport'

export default function GenerateReport() {
    const [view, setView] = useState('table') 
    const [currentReport, setCurrentReport] = useState(null)

    const handleAddView = () => {
        setCurrentReport(null)
        setView('add')
    }

    const handleEditReport = (report) => {
        setCurrentReport(report)
        setView('edit')
    }

    return (
        <div>
            {view === 'add' && (
                <AddGenerateReport
                    onBackClick={() => setView('table')}
                    onReportGenerated={(newReport) => {
                        setCurrentReport(newReport)
                        setView('edit')
                    }}
                />
            )}
           {view === 'edit' && (
                <EditGenerateReport
                    report={currentReport}
                    onBackClick={() => setView('table')}
                />
            )
        }
            {view === 'table' && (
                <GenerateReportTable 
                    onAddReportClick={handleAddView}
                    onEditReportClick={handleEditReport}
                />
            )}
        </div>
    )
}