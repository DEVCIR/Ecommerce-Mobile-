import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  FormGroup,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

function EditRmas({ rma, onBackClick, setViewToTable }) {
  document.title = "Edit RMA | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    resolution: "",
    resolved_date: ""
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/orders`);
        const data = await response.json();
        
        if (data && data.data && data.data.data) {
          const validOrders = data.data.data.filter(order => order.customer !== null);
          setOrders(validOrders);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();

    // Load RMA data if it exists
    if (rma) {
      setFormData({
        reason: rma.reason || "",
        resolution: rma.resolution || "",
        resolved_date: rma.resolved_date || new Date().toISOString().split('T')[0]
      });

      // If RMA has an order, set it as selected
      if (rma.order) {
        setSelectedOrder(rma.order);
        setCustomerName(rma.customer?.user?.name || "");
        // You might want to fetch order items here if needed
      }
    }
  }, [rma]);

  const fetchOrderItems = async (orderId) => {
    setItemsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/order-items?order_id=${orderId}`);
      const data = await response.json();
      
      if (data && data.data && data.data.data) {
        setOrderItems(data.data.data);
      } else {
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    if (orderId) {
      const selected = orders.find(order => order.id.toString() === orderId);
      setSelectedOrder(selected);
      fetchOrderItems(selected.id);
      
      if (selected.customer && selected.customer.user) {
        setCustomerName(`${selected.customer.user.name || ''}`);
      } else {
        setCustomerName("");
      }
    } else {
      setSelectedOrder(null);
      setCustomerName("");
      setOrderItems([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder) {
      alert("Please select an order first");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/rmas/${rma.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: formData.reason,
          resolution: formData.resolution,
          resolved_date: formData.resolved_date,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update RMA');
      }
  
      const data = await response.json();
      toast.success("RMA updated successfully");
      setTimeout(() => {
        setViewToTable();
      }, 1500);
    } catch (error) {
      console.error("Error updating RMA:", error);
      toast.error("Failed to update RMA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit RMA</CardTitle>
              <Form onSubmit={handleSubmit}>
              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">RMA Number</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="rma_number"
                      value={rma?.rma_number || ""}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Order</Label>
                  <Col md={10}>
                    {loading ? (
                      <Input type="select" disabled>
                        <option>Loading orders...</option>
                      </Input>
                    ) : (
                      <Input
                        type="select"
                        name="order"
                        onChange={handleOrderChange}
                        value={selectedOrder?.id || ""}
                        required
                      >
                        <option value="">Select order</option>
                        {orders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.order_number}
                          </option>
                        ))}
                      </Input>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Customer</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="customer"
                      value={customerName}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Reason</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="reason"
                      placeholder="Enter reason for return"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Resolution</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="resolution"
                      placeholder="Enter resolution"
                      value={formData.resolution}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2" type="button">
                      Back
                    </Button>
                    <Button color="primary" type="submit">
                      Update RMA
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default EditRmas;