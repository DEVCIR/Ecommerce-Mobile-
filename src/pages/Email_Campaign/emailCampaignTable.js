import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button, CardTitle, Table, Badge } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";

const EmailCampaignTable = (props) => {
    document.title = "Email Campaigns | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Email Campaigns", link: "#" },
    ]

    const [campaignData, setCampaignData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });

    const fetchCampaignData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/email-campaigns?page=${pagination.current_page}`);
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data.data)) {
                setCampaignData(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    total: result.data.total,
                    per_page: result.data.per_page
                });
                console.log("Email campaigns loaded:", result.data.data);
            } else {
                setCampaignData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching email campaign data:", error);
            setCampaignData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Email Campaigns', breadcrumbItems);
        fetchCampaignData();
    }, [pagination.current_page]);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const truncateContent = (content, length = 50) => {
        if (!content) return 'N/A';
        return content.length > length ? `${content.substring(0, length)}...` : content;
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Draft':
                return <Badge color="secondary">Draft</Badge>;
            case 'Scheduled':
                return <Badge color="info">Scheduled</Badge>;
            case 'Sent':
                return <Badge color="success">Sent</Badge>;
            case 'Failed':
                return <Badge color="danger">Failed</Badge>;
            default:
                return <Badge color="warning">{status}</Badge>;
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const handleDeleteCampaign = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/email-campaigns/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success('Email campaign deleted successfully');
                // Refresh the data after deletion
                fetchCampaignData();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete email campaign');
            }
        } catch (error) {
            console.error('Error deleting email campaign:', error);
            toast.error('An error occurred while deleting the email campaign');
        }
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
                                    <CardTitle className="h4">Email Campaigns</CardTitle>
                                </Col>
                                <Col style={{ display: 'flex', gap: '10px' }} className="text-end">
                                    <Button color="success" onClick={props.onAddEmailCampaignClick}>
                                        Add Email Campaign
                                    </Button>
                                </Col>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading email campaigns...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Campaign Name</th>
                                                <th>Template</th>
                                                <th>Subject</th>
                                                <th>Content</th>
                                                <th>Scheduled Time</th>
                                                <th>Status</th>
                                                <th>Sent</th>
                                                <th>Opens</th>
                                                <th>Clicks</th>
                                                <th>Created By</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaignData.length > 0 ? (
                                                campaignData.map(campaign => (
                                                    <tr key={campaign.id}>
                                                        <td>{displayField(campaign.campaign_name)}</td>
                                                        <td>{displayField(campaign.template?.template_name)}</td>
                                                        <td>{displayField(campaign.subject)}</td>
                                                        <td>{truncateContent(campaign.content)}</td>
                                                        <td>{formatDate(campaign.scheduled_time)}</td>
                                                        <td>{getStatusBadge(campaign.status)}</td>
                                                        <td>{displayField(campaign.sent_count)}</td>
                                                        <td>{displayField(campaign.open_count)}</td>
                                                        <td>{displayField(campaign.click_count)}</td>
                                                        <td>{displayField(campaign.created_by?.name)}</td>
                                                        <td>
                                                        <Button 
        color="primary" 
        size="sm" 
        onClick={() => props.onEditCampaignClick(campaign)}
        className="me-2"
    >
        Edit
    </Button>
                                                            <Button 
                                                                color="danger" 
                                                                size="sm" 
                                                                onClick={() => handleDeleteCampaign(campaign.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" className="text-center">No email campaign data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

                                    {pagination.total > pagination.per_page && (
                                        <div className="d-flex justify-content-between mt-3">
                                            <div>
                                                Showing {(pagination.current_page - 1) * pagination.per_page + 1} to 
                                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
                                            </div>
                                            <div>
                                                <Button 
                                                    color="primary" 
                                                    size="sm" 
                                                    disabled={pagination.current_page === 1}
                                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                                >
                                                    Previous
                                                </Button>
                                                <span className="mx-2">Page {pagination.current_page}</span>
                                                <Button 
                                                    color="primary" 
                                                    size="sm" 
                                                    disabled={pagination.current_page * pagination.per_page >= pagination.total}
                                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(EmailCampaignTable);