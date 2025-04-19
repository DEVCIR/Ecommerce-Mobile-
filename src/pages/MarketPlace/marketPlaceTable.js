import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Table, Button, Badge } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const MarketplaceTable = (props) => {
    document.title = "Marketplaces | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Marketplaces", link: "#" },
    ]

    const [marketplaceData, setMarketplaceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });

    const fetchMarketplaceData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/marketplaces?page=${page}`);
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data.data)) {
                setMarketplaceData(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    total: result.data.total,
                    per_page: result.data.per_page
                });
                console.log("Marketplaces loaded:", result.data.data);
            } else {
                setMarketplaceData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching marketplace data:", error);
            setMarketplaceData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Marketplaces', breadcrumbItems);
        fetchMarketplaceData();
    }, []);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatStatus = (isActive) => {
        return isActive ? (
            <Badge color="success">Active</Badge>
        ) : (
            <Badge color="danger">Inactive</Badge>
        );
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/marketplaces/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete marketplace');
            }
            
            toast.success("Marketplace deleted successfully");
            fetchMarketplaceData(pagination.current_page); 
        } catch (error) {
            console.error("Error deleting marketplace:", error);
            toast.error("Failed to delete marketplace");
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
                                <CardTitle className="h4 mb-0">Marketplaces</CardTitle>
                                <Button 
                                    color="primary" 
                                    onClick={props.onAddItemClick}
                                >
                                    <i className="bx bx-plus me-1"></i> Add Marketplace
                                </Button>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading marketplaces...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>API Credentials</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {marketplaceData.length > 0 ? (
                                                marketplaceData.map(marketplace => (
                                                    <tr key={marketplace.id}>
                                                        <td>{displayField(marketplace.name)}</td>
                                                        <td>{displayField(marketplace.description)}</td>
                                                        <td>{displayField(marketplace.api_credentials)}</td>
                                                        <td>{formatStatus(marketplace.is_active)}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <Button 
                                                                    color="primary" 
                                                                    size="sm"
                                                                    onClick={() => props.onEditItemClick(marketplace)}
                                                                >
                                                                    <i className="bx bx-edit-alt"></i> Edit
                                                                </Button>
                                                                <Button 
                                                                    color="danger" 
                                                                    size="sm"
                                                                    onClick={() => handleDelete(marketplace.id)}
                                                                >
                                                                    <i className="bx bx-trash"></i> Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No marketplace data available</td>
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

export default connect(null, { setBreadcrumbItems })(MarketplaceTable);