import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from 'react-toastify';
import {BASE_URL} from '../../Service';

const RmasTable = (props) => {
    document.title = "RMAs | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "RMAs", link: "#" },
    ]

    const [rmaData, setRmaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });
    const [deleteModal, setDeleteModal] = useState(false);
    const [rmaToDelete, setRmaToDelete] = useState(null);

    const fetchRmaData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/rmas?page=${page}`);
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data.data)) {
                setRmaData(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    total: result.data.total,
                    per_page: result.data.per_page
                });
                console.log("RMAs loaded:", result.data.data);
            } else {
                setRmaData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching RMA data:", error);
            setRmaData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('RMAs', breadcrumbItems);
        fetchRmaData();
    }, []);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleEditClick = (rma) => {
        props.onEditRma(rma);
    };

    const handleDeleteClick = (rma) => {
        setRmaToDelete(rma);
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!rmaToDelete) return;
        
        try {
            const response = await fetch(`${BASE_URL}/rmas/${rmaToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                toast.success('RMA and related items deleted successfully');
                fetchRmaData(pagination.current_page); 
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete RMA');
            }
        } catch (error) {
            console.error('Error deleting RMA:', error);
            toast.error('An error occurred while deleting the RMA');
        } finally {
            setDeleteModal(false);
            setRmaToDelete(null);
        }
    };

    return (
        <React.Fragment>
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <CardTitle className="h4 mb-0">Return Merchandise Authorizations</CardTitle>
                                <Button 
                                    color="primary" 
                                    onClick={props.onAddRmasClick}
                                >
                                    <i className="bx bx-plus me-1"></i> Add RMA
                                </Button>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading RMAs...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>RMA Number</th>
                                                <th>Customer</th>
                                                <th>Order ID</th>
                                                <th>Request Date</th>
                                                <th>Status</th>
                                                <th>Reason</th>
                                                <th>Resolution</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rmaData.length > 0 ? (
                                                rmaData.map(rma => (
                                                    <tr key={rma.id}>
                                                        <td>{displayField(rma.rma_number)}</td>
                                                        <td>{displayField(rma.customer?.user?.name)}</td>
                                                        <td>{displayField(rma.order?.order_number)}</td>
                                                        <td>{formatDate(rma.request_date)}</td>
                                                        <td>{displayField(rma.status)}</td>
                                                        <td>{displayField(rma.reason)}</td>
                                                        <td>{displayField(rma.resolution)}</td>
                                                        <td>
                                                            <Button 
                                                                color="primary"
                                                                size="sm"
                                                                onClick={() => handleEditClick(rma)}
                                                                className="me-1"
                                                            >
                                                                <i className="bx bx-edit-alt"></i> Edit
                                                            </Button>
                                                            <Button 
                                                                color="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(rma)}
                                                            >
                                                                <i className="bx bx-trash"></i> Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No RMA data available</td>
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

            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
                <ModalHeader toggle={() => setDeleteModal(false)}>Confirm Delete</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete RMA {rmaToDelete?.rma_number}? This will also delete all related items and cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button color="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(RmasTable);

