import React, { useEffect, useState } from "react"

import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "sonner";
import {BASE_URL} from '../../Service';


const BuyersTable = (props) => {
    document.title = "Responsive Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]

    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/customers`);
            const result = await response.json();
            setCustomers(result.data.data); 
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };


    useEffect(() => {
        props.setBreadcrumbItems('Responsive Table', breadcrumbItems);
        fetchCustomers();
    }, [props]);

    const onEditCustomer = (customerId) => {
        props.onEditCustomer(customerId); 
    };

    const handleDeleteCustomer = async (customerId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${BASE_URL}/users/${customerId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
            });

            if (response.ok) {
                toast.success('Customer deleted successfully');
                // Update the state to remove the deleted customer
                setCustomers(customers.filter(customer => customer.id !== customerId));
                fetchCustomers();
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
                                    <CardTitle className="h4">Customer Table</CardTitle>
                                </Col>
                                <div style={{ display: 'flex' }} className="text-end">
                                    {/* <Button color="info" style={{ marginRight: 2, padding: '10px 0' }}>Download Excel</Button> */}
                                    <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={props.onAddBuyerClick}>Add Customer</Button>
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
                                                <Th>Email</Th>
                                                <Th>Phone Number</Th>
                                                <Th>Customer Type</Th>
                                                <Th>Is Active</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {customers.map(customer => (
                                                <Tr key={customer.id}>
                                                    <Td>{customer.user.name} {customer.user.last_name}</Td>
                                                    <Td>{customer.user.email || "N/A"}</Td>
                                                    <Td>{customer.user.phone_number || "N/A"}</Td>
                                                    <Td>{customer.customer_type || "N/A"}</Td>
                                                    <Td>{customer.is_active ? 'Yes' : 'No'}</Td>
                                                    <Td>
                                                        <Button color="warning" onClick={() => onEditCustomer(customer.id)}>Edit</Button>
                                                        <Button color="danger" onClick={() => handleDeleteCustomer(customer.user.id)} style={{ marginLeft: '5px' }}>Delete</Button>
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
export default connect(null, { setBreadcrumbItems })(BuyersTable);