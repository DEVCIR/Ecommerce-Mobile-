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

function AddDeliveryNote({ onBackClick }) {
  document.title = "Add Delivery Note | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const delivery_number = `DEV-${Math.floor(Math.random() * 1000)}`;
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_method: "",
    tracking_number: "",
    notes: ""
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
      alert("Please select at least one item for the delivery note");
      return;
    }
  
    const deliveryNoteData = {
      delivery_number,
      order_id: selectedOrder.id,
      customer_id: selectedOrder.customer.id,
      delivery_date: new Date().toISOString().split('T')[0],
      shipping_method: formData.shipping_method,
      tracking_number: formData.tracking_number.toString(),
      status: "Preparing",
      notes: formData.notes,
      created_by: 1
    };
  
    try {
      // First, create the delivery note
      const response = await fetch(`${BASE_URL}/delivery-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryNoteData)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error creating delivery note:", data);
        alert("Error creating delivery note: " + (data.message || "Unknown error"));
        return;
      }
  
      
      const deliveryNoteId = data.id || data.data.id;
      
      
      const createdItems = [];
      const errors = [];
      
      for (const item of orderItems) {
        try {
          const itemResponse = await fetch(`${BASE_URL}/delivery-note-items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              delivery_note_id: deliveryNoteId,
              inventory_id: item.inventory.id,
              quantity: item.quantity
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
            console.error("Error creating delivery note item:", errorData);
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
        alert(`Delivery note created but ${errors.length} items failed. See console for details.`);
        console.log("Failed items:", errors);
      } else {
        // alert("Delivery note and all items created successfully!");
      }
      toast.success("Delivery note and all items created successfully");
            setTimeout(() => {
                onBackClick();
            }, 1500);
      
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred while creating delivery note");
    }
  };


  return (
    <React.Fragment>
         <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Delivery Note</CardTitle>
              <Form onSubmit={handleSubmit}>
              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Delivery Number</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="delivery_number"
                      value={delivery_number}
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
                  <Label className="col-md-2 col-form-label">Delivery Date</Label>
                  <Col md={10}>
                    <Input
                      type="date"
                      name="delivery_date"
                      value={new Date().toISOString().split('T')[0]}
                      readOnly
                    />
                  </Col>
                </Row>

               
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Shipping Method</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="shipping_method"
                      placeholder="Enter shipping method"
                      value={formData.shipping_method}
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                </Row>

                
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Tracking Number</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="tracking_number"
                      placeholder="Enter tracking number"
                      value={formData.tracking_number}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>

               
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Notes</Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="notes"
                      rows="4"
                      placeholder="Enter any additional notes"
                      value={formData.notes}
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
                      Save Delivery Note
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

export default AddDeliveryNote;