import React from "react"
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

const CustomerTable = (customers) => {
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
                            </div>

                            <div className="table   -rep-plugin">
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
                                                <Th>ORder Item</Th>
                                                <Th>Email</Th>
                                                <Th>Phone Number</Th>
                                                <Th>Customer Type</Th>
                                                <Th>Is Active</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {customers.customers.map(customer => (
                                                <Tr key={customer.id}>
                                                    <Td>{customer.customer.user.name} {customer.customer.user.last_name}</Td>
                                                    <Td>{customer.customer.user.email}</Td>
                                                    <Td>{customer.customer.user.phone_number}</Td>
                                                    <Td>{customer.customer.customer_type}</Td>
                                                    <Td>{customer.customer.is_active ? 'Yes' : 'No'}</Td>
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
export default CustomerTable;