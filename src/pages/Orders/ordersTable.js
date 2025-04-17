import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from 'react-router-dom';

const OrderTable = ({ onAddOrderClick }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayValue = (value) => {
    return value == null ? 'N/A' : value;
  };

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
                <Col style={{ display: 'flex' }} className="text-end">
                  <Button color="secondary" style={{ marginRight: 2, padding: '10px 0' }} onClick={() => navigate('/invoiceupload')}>
                    Upload Order File
                  </Button>
                  <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={onAddOrderClick}>
                    Add Order
                  </Button>
                </Col>
              </div>
              
              <div className="table-rep-plugin">
                <div className="table-responsive mb-0">
                  <Table id="tech-companies-1" className="table table-striped table-bordered">
                    <Thead>
                      <Tr>
                        <Th>Order Number</Th>
                        <Th>Customer</Th>
                        <Th>Order Date</Th>
                        <Th>Status</Th>
                        <Th>Total Amount</Th>
                        <Th>Discount</Th>
                        <Th>Tax</Th>
                        <Th>Shipping</Th>
                        <Th>Grand Total</Th>
                        <Th>Payment Method</Th>
                        <Th>Payment Status</Th>
                        <Th>Shipping Address</Th>
                        <Th>Notes</Th>
                        <Th>Active</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
  {orders.map((order) => (
    <Tr key={order.id}>
      <Td>{displayValue(order.order_number)}</Td>
      <Td>{order.customer?.user?.name || 'N/A'}</Td>
      <Td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</Td>
      <Td>{displayValue(order.status)}</Td>
      <Td>{displayValue(order.total_amount)}</Td>
      <Td>{displayValue(order.discount_amount)}</Td>
      <Td>{displayValue(order.tax_amount)}</Td>
      <Td>{displayValue(order.shipping_amount)}</Td>
      <Td>{displayValue(order.grand_total)}</Td>
      <Td>{displayValue(order.payment_method)}</Td>
      <Td>{displayValue(order.payment_status)}</Td>
      <Td>{displayValue(order.shipping_address)}</Td>
      <Td>{displayValue(order.notes)}</Td>
      <Td>{order.is_active ? 'Yes' : 'No'}</Td>
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

export default OrderTable;