import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Table, Button } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const ReportTemplateTable = (props) => {
    document.title = "Report Templates | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Report Templates", link: "#" },
    ]

    const [templateData, setTemplateData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });

    const fetchTemplateData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/report-templates?page=${page}`);
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data.data)) {
                setTemplateData(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    total: result.data.total,
                    per_page: result.data.per_page
                });
                console.log("Report templates loaded:", result.data.data);
            } else {
                setTemplateData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching report template data:", error);
            setTemplateData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (templateId) => {
        try {
            if (window.confirm('Are you sure you want to delete this template?')) {
                const response = await fetch(`${BASE_URL}/report-templates/${templateId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    // Refresh the data after successful deletion
                    fetchTemplateData();
                    toast.success("Report Template deleted successfully!");
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting template: ${errorData.message || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Error deleting template. Please try again.');
        }
    };


    useEffect(() => {
        props.setBreadcrumbItems('Report Templates', breadcrumbItems);
        fetchTemplateData();
    }, []);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    return (
        <React.Fragment>
            <Toaster position="top-right" richColors />
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <CardTitle className="h4 mb-0">Report Templates</CardTitle>
                                <Button 
                                    color="primary" 
                                    onClick={props.onAddTemplateClick}
                                >
                                    <i className="bx bx-plus me-1"></i> Add Template
                                </Button>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading report templates...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Template Name</th>
                                                <th>Description</th>
                                                <th>File Path</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {templateData.length > 0 ? (
                                                templateData.map(template => (
                                                    <tr key={template.id}>
                                                        <td>{displayField(template.template_name)}</td>
                                                        <td>{displayField(template.description)}</td>
                                                        <td>{displayField(template.template_file_path)}</td>
                                                        <td>
                                                            <Button color="primary" size="sm" className="me-2"
                                                            onClick={() => props.onEditTemplateClick(template)}>
                                                                <i className="bx bx-edit"></i> Edit
                                                            </Button>
                                                            <Button color="danger" size="sm" onClick={() => handleDelete(template.id)}>
                                                                <i className="bx bx-trash"></i> Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No report templates available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(ReportTemplateTable);