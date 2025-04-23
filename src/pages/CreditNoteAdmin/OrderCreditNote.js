import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const OrderCreditNote = ({ ordersss, onPrintOrder }) => {
    const [selectedItems, setSelectedItems] = useState({});
    const [reasons, setReasons] = useState({});
    const [orders, setOrders] = useState(ordersss); // Initialize state with props

    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleReasonChange = (id, value) => {
        setReasons((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handlePrintData = (order) => {
        const reason = reasons[order.id] || '';
        if (reason) {
            const updatedOrder = { ...order, reason };
            const updatedOrders = orders[0].order.items.map(item =>
                item.id === order.id ? updatedOrder : item
            );

            const reasoning = {
                orders: [{
                    ...orders[0],
                    order: {
                        ...orders[0].order,
                        items: updatedOrders
                    }
                }]
            }

            setOrders({
                orders: [{
                    ...orders[0],
                    order: {
                        ...orders[0].order,
                        items: updatedOrders
                    }
                }]
            }); 

            console.log('Orders:', updatedOrders);
            console.log('Updated Orders:', reasoning);
            onPrintOrder(reasoning); 
        } else {
            console.log(`No reason provided for order ID: ${order.id}`);
        }
    };

    const handlePrintAllData = () => {
        const updatedOrders = orders[0].order.items.map(item => {
            const reason = reasons[item.id] || '';
            return reason ? { ...item, reason } : item;
        });

        const reasoning = {
            orders: [{
                ...orders[0],
                order: {
                    ...orders[0].order,
                    items: updatedOrders
                }
            }]
        };

        setOrders({
            orders: [{
                ...orders[0],
                order: {
                    ...orders[0].order,
                    items: updatedOrders
                }
            }]
        });

        console.log('Updated Orders:', reasoning);
        onPrintOrder(reasoning);
    };

    useEffect(() => {
        console.log('Initial orders:', orders);
    }, [orders]);

    return (
        <React.Fragment>
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Order Table</CardTitle>
                                </Col>
                            </div>

                            <div className="table-rep-plugin">
                                <div className="table-responsive mb-0">
                                    <Table id="tech-companies-1" className="table table-striped table-bordered">
                                        <Thead>
                                            <Tr>
                                                <Th>Select</Th>
                                                <Th>Product</Th>
                                                <Th>Quantity</Th>
                                                <Th>Discount Amount</Th>
                                                <Th>Total Price</Th>
                                                {Object.keys(selectedItems).some(key => selectedItems[key]) && <Th>Reason</Th>}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {orders[0].order.items.map((order) => (
                                                <Tr key={order.id}>
                                                    <Td>
                                                        <input
                                                            type="checkbox"
                                                            checked={!!selectedItems[order.id]}
                                                            onChange={() => handleCheckboxChange(order.id)}
                                                        />
                                                    </Td>
                                                    <Td>{order.inventory.variant.product.model_name}</Td>
                                                    <Td>{order.quantity}</Td>
                                                    <Td>{order.discount_amount}</Td>
                                                    <Td>{order.total_price}</Td>
                                                    {selectedItems[order.id] && (
                                                        <Td>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter reason"
                                                                onChange={(e) => handleReasonChange(order.id, e.target.value)}
                                                            />
                                                        </Td>
                                                    )}
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </div>
                            </div>
                            {Object.keys(reasons).some(key => reasons[key]) && (
                                <Button onClick={() => handlePrintAllData()}>Print All Data</Button>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default OrderCreditNote;