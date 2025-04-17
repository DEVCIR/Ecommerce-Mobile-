import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button, CardTitle, Table } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";

const EmailTemplateTable = (props) => {
    document.title = "Email Templates | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Email Templates", link: "#" },
    ]

    const [emailTemplateData, setEmailTemplateData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEmailTemplateData = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/email-templates");
            const result = await response.json();
            
            if (result.success && Array.isArray(result.data)) {
                setEmailTemplateData(result.data);
                console.log("Email templates loaded:", result.data);
            } else {
                setEmailTemplateData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching email template data:", error);
            setEmailTemplateData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Email Templates', breadcrumbItems);
        fetchEmailTemplateData();
    }, [props]);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const truncateContent = (content, length = 50) => {
        if (!content) return 'N/A';
        return content.length > length ? `${content.substring(0, length)}...` : content;
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/email-templates/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                toast.success('Email template deleted successfully');
                // Refresh the data after deletion
                fetchEmailTemplateData();
            } else {
                toast.error(result.message || 'Failed to delete email template');
            }
        } catch (error) {
            console.error("Error deleting email template:", error);
            toast.error('An error occurred while deleting the email template');
        }
    };

    const handleEdit = (template) => {
        props.onEditTemplateClick(template);
    };

    return (
        <React.Fragment>
            <Toaster position="top-right" richColors />
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Email Templates</CardTitle>
                                </Col>
                                <Col style={{ display: 'flex', gap: '10px' }} className="text-end">
                                    <Button color="success" onClick={props.onAddEmailTemplateClick}>
                                        Add Email Template
                                    </Button>
                                </Col>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading email templates...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Template Name</th>
                                                <th>Subject</th>
                                                <th>Content</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emailTemplateData.length > 0 ? (
                                                emailTemplateData.map(template => (
                                                    <tr key={template.id}>
                                                        <td>{displayField(template.template_name)}</td>
                                                        <td>{displayField(template.subject)}</td>
                                                        <td>{truncateContent(template.content)}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <Button 
                                                                    color="primary" 
                                                                    size="sm"
                                                                    onClick={() => handleEdit(template)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button 
                                                                    color="danger" 
                                                                    size="sm"
                                                                    onClick={() => handleDelete(template.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No email template data available</td>
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

export default connect(null, { setBreadcrumbItems })(EmailTemplateTable);