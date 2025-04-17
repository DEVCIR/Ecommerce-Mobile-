import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Table, Button } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";

const CampaignRecepTable = (props) => {
    document.title = "Campaign Recipients | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Campaign Recipients", link: "#" },
    ]

    const [campaignRecepData, setCampaignRecepData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });

    const fetchCampaignRecepData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/campaign-recipients?page=${page}`);
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data.data)) {
                setCampaignRecepData(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    total: result.data.total,
                    per_page: result.data.per_page
                });
                console.log("Campaign recipients loaded:", result.data.data);
            } else {
                setCampaignRecepData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching campaign recipients data:", error);
            setCampaignRecepData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Campaign Recipients', breadcrumbItems);
        fetchCampaignRecepData();
    }, []);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/campaign-recipients/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete recipient');
            }
            
            toast.success("Recipient deleted successfully");
            fetchCampaignRecepData(pagination.current_page); 
        } catch (error) {
            console.error("Error deleting recipient:", error);
            toast.error("Failed to delete recipient");
        }
    };
    return (
        <React.Fragment>
            <Toaster position="top-right" richColors />
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <CardTitle className="h4 mb-0">Campaign Recipients</CardTitle>
                                <Button 
                                    color="primary" 
                                    onClick={props.onAddCampaignRecepClick}
                                >
                                    <i className="bx bx-plus me-1"></i> Add Recipient
                                </Button>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading campaign recipients...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Campaign</th>
                                                <th>Subscriber</th>
                                                <th>Email Address</th>
                                                <th>Status</th>
                                                <th>Sent Time</th>
                                                <th>Open Time</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaignRecepData.length > 0 ? (
                                                campaignRecepData.map(recipient => (
                                                    <tr key={recipient.id}>
                                                        <td>{displayField(recipient.campaign.campaign_name)}</td>
                                                        <td>{displayField(recipient.subscriber.first_name)}</td>
                                                        <td>{displayField(recipient.email_address)}</td>
                                                        <td>{displayField(recipient.status)}</td>
                                                        <td>{formatDateTime(recipient.sent_time)}</td>
                                                        <td>{formatDateTime(recipient.open_time)}</td>
                                                        <td>
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            
                    <Button 
                        color="primary" 
                        size="sm"
                        onClick={() => props.onEditRecepClick(recipient)}
                    >
                        <i className="bx bx-edit-alt"></i> Edit
                    </Button>
                    <Button 
                                                                    color="danger" 
                                                                    size="sm"
                                                                    onClick={() => handleDelete(recipient.id)}
                                                                >
                                                                    <i className="bx bx-trash"></i> Delete
                                                                </Button>
                                                                </div>
                </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">No campaign recipient data available</td>
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

export default connect(null, { setBreadcrumbItems })(CampaignRecepTable);