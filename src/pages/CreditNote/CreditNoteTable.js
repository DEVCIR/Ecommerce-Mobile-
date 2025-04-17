import React, { useEffect, useState } from "react"

import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

import { connect } from "react-redux";

import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "sonner";

const CreditNoteTable = (props) => {
    document.title = "Responsive Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]

    const [customers, setCustomers] = useState([]);

    const fetchCreditNotes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/credit-notes');
            const result = await response.json();
            setCustomers(result.data.data);
        } catch (error) {
            console.error("Error fetching credit note data:", error);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Responsive Table', breadcrumbItems);
        fetchCreditNotes();
    }, [props]);

    const onEdit = (customerId) => {
        props.onEditCustomer(customerId); 
    };

    const handleDelete = async (customerId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Credit Note?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/credit-notes/${customerId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
            });

            if (response.ok) {
                toast.success('Customer deleted successfully');
                // Update the state to remove the deleted customer
                setCustomers(customers.filter(customer => customer.id !== customerId));
                fetchCreditNotes();
            } else {
                const errorResult = await response.json();
                console.error("Error deleting customer:", errorResult);
                toast.error('Error deleting customer. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('An error occurred while deleting the customer. Please try again.');
        }
    };

    return (
        <React.Fragment>

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Credit Note Table</CardTitle>
                                </Col>
                                <div style={{ display: 'flex' }} className="text-end">
                                    {/* <Button color="info" style={{ marginRight: 2, padding: '10px 0' }}>Download Excel</Button> */}
                                    <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={props.onAddBuyerClick}>Add Credit Note</Button>
                                </div>
                            </div>

                            <div className="table-rep-plugin">
                                <div
                                    className="table-responsive mb-0"
                                    data-pattern="priority-columns"
                                >
                                    <Table
                                        id="tech-companies-1"
                                        className="table table-striped table-bordered"
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Amount</Th>
                                                <Th>Created By</Th>
                                                <Th>Customer Type</Th>
                                                <Th>Is Active</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {customers.map(creditNote => (
                                                <Tr key={creditNote.id}>
                                                    <Td>{creditNote.credit_note_number}</Td>
                                                    <Td>{creditNote.total_amount}</Td>
                                                    <Td>{creditNote.created_by.name} {creditNote.created_by.last_name}</Td>
                                                    <Td>{creditNote.customer.customer_type}</Td>
                                                    <Td>{creditNote.is_active ? 'Yes' : 'No'}</Td>
                                                    <Td>
                                                        <Button color="warning" onClick={() => onEdit(creditNote.id)}>Edit</Button>
                                                        <Button color="danger" onClick={() => handleDelete(creditNote.id)} style={{ marginLeft: '5px' }}>Delete</Button>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </React.Fragment>
    )
}
export default connect(null, { setBreadcrumbItems })(CreditNoteTable);