import React, { useEffect, useState } from "react"

import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "sonner";
import {BASE_URL} from '../../Service';

const ExpenseTable = (props) => {
    document.title = "Responsive Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]

    const [customers, setCustomers] = useState([]);

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`${BASE_URL}/expenses`);
            const result = await response.json();
            setCustomers(result.data.data);
        } catch (error) {
            console.error("Error fetching expense data:", error);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Responsive Table', breadcrumbItems);
        fetchExpenses();
    }, [props]);

    const onEdit = (customerId) => {
        props.onEditCustomer(customerId); 
    };

    const handleDelete = async (customerId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Expense?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${BASE_URL}/expenses/${customerId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
            });

            if (response.ok) {
                toast.success('Customer deleted successfully');
                // Update the state to remove the deleted customer
                setCustomers(customers.filter(customer => customer.id !== customerId));
                fetchExpenses();
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
                                    <CardTitle className="h4">Expense Table</CardTitle>
                                </Col>
                                <div style={{ display: 'flex' }} className="text-end">
                                    {/* <Button color="info" style={{ marginRight: 2, padding: '10px 0' }}>Download Excel</Button> */}
                                    <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={props.onAddBuyerClick}>Add Expense</Button>
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
                                                <Th>Recorded By</Th>
                                                <Th>Customer Type</Th>
                                                <Th>Is Active</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {customers.map(expense => (
                                                <Tr key={expense.id}>
                                                    <Td>{expense.description}</Td>
                                                    <Td>{expense.amount}</Td>
                                                    <Td>{expense.recorded_by.name} {expense.recorded_by.last_name}</Td>
                                                    <Td>{expense.category.category_name}</Td>
                                                    <Td>{expense.is_active ? 'Yes' : 'No'}</Td>
                                                    <Td>
                                                        <Button color="primary" onClick={() => onEdit(expense.id)}>Edit</Button>
                                                        <Button color="danger" onClick={() => handleDelete(expense.id)} style={{ marginLeft: '5px' }}>Delete</Button>
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
export default connect(null, { setBreadcrumbItems })(ExpenseTable);