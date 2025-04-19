import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button, CardTitle, Table } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const PurchaseOrderTable = (props) => {
    document.title = "Purchase Orders | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Purchase Orders", link: "#" },
    ]

    const [purchaseOrderData, setPurchaseOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPurchaseOrderData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/purchase-orders`);
            const result = await response.json();
            
            if (result.data && result.data.data && Array.isArray(result.data.data)) {
                setPurchaseOrderData(result.data.data);
                console.log("Purchase orders loaded:", result.data.data);
            } else {
                setPurchaseOrderData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching purchase order data:", error);
            setPurchaseOrderData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Purchase Orders', breadcrumbItems);
        fetchPurchaseOrderData();
    }, [props]);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
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
                                    <CardTitle className="h4">Purchase Orders</CardTitle>
                                </Col>
                                <Col style={{ display: 'flex', gap: '10px' }} className="text-end">
                                    <Button color="success" onClick={props.onAddPurchaseOrderClick}>
                                        Add Purchase Order
                                    </Button>
                                </Col>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading purchase orders...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Supplier</th>
                                                <th>PO Number</th>
                                                <th>Order Date</th>
                                                <th>Expected Delivery</th>
                                                <th>Status</th>
                                                <th>Total Amount</th>
                                                <th>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchaseOrderData.length > 0 ? (
                                                purchaseOrderData.map(order => (
                                                    <tr key={order.id}>
                                                        <td>{displayField(order.supplier.user.name)}</td>
                                                        <td>{displayField(order.po_number)}</td>
                                                        <td>{formatDate(order.order_date)}</td>
                                                        <td>{formatDate(order.expected_delivery_date)}</td>
                                                        <td>{displayField(order.status)}</td>
                                                        <td>{order.total_amount ? `$${parseFloat(order.total_amount).toFixed(2)}` : 'N/A'}</td>
                                                        <td>{displayField(order.notes)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No purchase order data available</td>
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

export default connect(null, { setBreadcrumbItems })(PurchaseOrderTable);