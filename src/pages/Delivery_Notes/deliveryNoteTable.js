import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Table, Button } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";

const DeliveryNoteTable = (props) => {
    document.title = "Delivery Notes | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Delivery Notes", link: "#" },
    ]

    const [deliveryNoteData, setDeliveryNoteData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });

    const fetchDeliveryNoteData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/delivery-notes?page=${page}`);
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data.data)) {
                setDeliveryNoteData(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    total: result.data.total,
                    per_page: result.data.per_page
                });
                console.log("Delivery notes loaded:", result.data.data);
            } else {
                setDeliveryNoteData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching delivery note data:", error);
            setDeliveryNoteData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Delivery Notes', breadcrumbItems);
        fetchDeliveryNoteData();
    }, []);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= Math.ceil(pagination.total / pagination.per_page)) {
            fetchDeliveryNoteData(page);
        }
    };

    return (
        <React.Fragment>
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <CardTitle className="h4 mb-0">Delivery Notes</CardTitle>
                                <Button 
                                    color="primary" 
                                    onClick={props.onAddDeliveryNoteClick}
                                >
                                    <i className="bx bx-plus me-1"></i> Add Delivery Note
                                </Button>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading delivery notes...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Delivery Number</th>
                                                <th>Order ID</th>
                                                <th>Customer ID</th>
                                                <th>Delivery Date</th>
                                                <th>Shipping Method</th>
                                                <th>Tracking Number</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deliveryNoteData.length > 0 ? (
                                                deliveryNoteData.map(note => (
                                                    <tr key={note.id}>
                                                        <td>{displayField(note.delivery_number)}</td>
                                                        <td>{displayField(note.order.order_number)}</td>
                                                        <td>{displayField(note.order.customer.user.name)}</td>
                                                        <td>{formatDate(note.delivery_date)}</td>
                                                        <td>{displayField(note.shipping_method)}</td>
                                                        <td>{displayField(note.tracking_number)}</td>
                                                        <td>{displayField(note.status)}</td>
                                                        <td>{displayField(note.notes)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No delivery note data available</td>
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

export default connect(null, { setBreadcrumbItems })(DeliveryNoteTable);