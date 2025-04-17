import React from "react";
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const InvoiceTable = ({ invoices }) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <Col>
                                    <CardTitle className="h4">Invoice Table</CardTitle>
                                </Col>
                            </div>

                            <div className="table-rep-plugin">
                                <div className="table-responsive mb-0">
                                    <Table id="tech-companies-1" className="table table-striped table-bordered">
                                        <Thead>
                                            <Tr>
                                                <Th>Invoice Number</Th>
                                                <Th>Total Amount</Th>
                                                <Th>Discount Amount</Th>
                                                <Th>Grand Total</Th>
                                                <Th>Payment Method</Th>
                                                <Th>Address</Th>
                                                <Th>City</Th>
                                                <Th>Country</Th>
                                                <Th>Phone Number</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {invoices.map((invoice) => (
                                                <Tr key={invoice.id}>
                                                    <Td>{invoice.invoice_number}</Td>
                                                    <Td>{invoice.order?.total_amount}</Td>
                                                    <Td>{invoice.order?.discount_amount}</Td>
                                                    <Td>{invoice.order?.grand_total}</Td>
                                                    <Td>{invoice.order?.payment_method}</Td>
                                                    <Td>{invoice.customer.address}</Td>
                                                    <Td>{invoice.customer.city}</Td>
                                                    <Td>{invoice.customer.country}</Td>
                                                    <Td>{invoice.customer.user.phone_number}</Td>
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
    );
};

export default InvoiceTable;