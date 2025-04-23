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

function AddRmaItem({ onBackClick }) {
  document.title = "Add RMA | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const rma_number = `RMAS-${Math.floor(Math.random() * 1000)}`;
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
  }, []);

  const fetchOrderItems = async (orderId) => {
    setItemsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/order-items?order_id=${orderId}`);
      const data = await response.json();
      
      if (data && data.data && data.data.data) {
        setOrderItems(data.data.data);
        logInventoryIds(data.data.data);
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

  const logInventoryIds = (items) => {
    console.log("Current inventory IDs:", items.map(item => item.inventory.id));
  };

  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    if (orderId) {
      const selected = orders.find(order => order.id.toString() === orderId);
      setSelectedOrder(selected);
      
      console.log("Selected Order ID:", selected.id);
      console.log("Customer Id: ", selected.customer.id);
      
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

  const handleDeleteItem = (itemId) => {
    setOrderItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      console.log(`Deleted item with ID: ${itemId}`);
      logInventoryIds(updatedItems); 
      return updatedItems;
    });
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
  
    if (orderItems.length === 0) {
      alert("Please select at least one item for the RMA");
      return;
    }
  
    const rmaData = {
      rma_id: selectedOrder.id,
      customer_id: selectedOrder.customer.id,
      resolved_date: new Date().toISOString().split('T')[0],
      status: "Approved",
      reason: formData.reason,
      resolution: formData.resolution,
      resolved_by: 1,
      is_active: true
    };
  
    try {
      const createdItems = [];
      const errors = [];
      
      for (const item of orderItems) {
        try {
          const itemResponse = await fetch("http://localhost:8000/api/rma-items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rma_id: rmaData.rma_id,
              inventory_id: item.inventory.id,
              quantity: item.quantity,
              reason: rmaData.reason,
              condition_received: item.condition_received || null,
              is_active: true
            })
          });
          
          if (itemResponse.ok) {
            const itemData = await itemResponse.json();
            createdItems.push(itemData);
          } else {
            const errorData = await itemResponse.json();
            errors.push({
              item,
              error: errorData.message || "Unknown error"
            });
            console.error("Error creating RMA item:", errorData);
          }
        } catch (error) {
          errors.push({
            item,
            error: error.message
          });
          console.error("Network error creating item:", error);
        }
      }
  
      if (errors.length > 0) {
        alert(`RMA created but ${errors.length} items failed. See console for details.`);
        console.log("Failed items:", errors);
      } else {
        toast.success("RMA and all items created successfully");
        setTimeout(() => {
          onBackClick();
        }, 1500);
      }
      
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred while creating RMA");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add RMA</CardTitle>
              <Form onSubmit={handleSubmit}>
              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">RMA Number</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="rma_number"
                      value={rma_number}
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
                      placeholder="Customer will auto-populate when order is selected"
                    />
                  </Col>
                </Row>

                {itemsLoading ? (
                  <Row className="mb-3">
                    <Col md={{ offset: 2, size: 10 }}>
                      <p>Loading order items...</p>
                    </Col>
                  </Row>
                ) : orderItems.length > 0 ? (
                  <>
                    {orderItems.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <Row className="mb-3 align-items-center">
                          <Label className="col-md-2 col-form-label">
                            {`Product ${index + 1}`}
                          </Label>
                          <Col md={8}>
                            <Input
                              type="text"
                              readOnly
                              value={item.inventory?.variant?.product?.model_name || 'N/A'}
                            />
                          </Col>
                          <Col md={2}>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              type="button"
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Label className="col-md-2 col-form-label">
                            {`Quantity ${index + 1}`}
                          </Label>
                          <Col md={10}>
                            <Input
                              type="text"
                              readOnly
                              value={item.quantity}
                            />
                          </Col>
                        </Row>
                      </React.Fragment>
                    ))}
                  </>
                ) : selectedOrder && (
                  <Row className="mb-3">
                    <Col md={{ offset: 2, size: 10 }}>
                      <p>No items found for this order.</p>
                    </Col>
                  </Row>
                )}

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Resolved Date</Label>
                  <Col md={10}>
                    <Input
                      type="date"
                      name="resolved_date"
                      value={new Date().toISOString().split('T')[0]}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Status</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="status"
                      value="Approved"
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
                      Save RMA
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

export default AddRmaItem;