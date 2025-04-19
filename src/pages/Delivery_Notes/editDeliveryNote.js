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

function EditDeliveryNote({ note, onBackClick }) {
  document.title = "Edit Delivery Note | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    shipping_method: "",
    tracking_number: "",
    notes: "",
    delivery_date: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/orders`);
        const data = await response.json();
        
        if (data?.data?.data) {
          setOrders(data.data.data);
          
          // Set initial selected order and customer from the note
          if (note) {
            const order = data.data.data.find(o => o.id === note.order.id);
            setSelectedOrder(order);
            setCustomerName(order?.customer?.user?.name || "");
            
            // Set form data from the note
            setFormData({
              shipping_method: note.shipping_method || "",
              tracking_number: note.tracking_number || "",
              notes: note.notes || "",
              delivery_date: note.delivery_date ? note.delivery_date.split('T')[0] : new Date().toISOString().split('T')[0],
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [note]);

  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    if (orderId) {
      const selected = orders.find(order => order.id.toString() === orderId);
      setSelectedOrder(selected);
      
      if (selected?.customer?.user) {
        setCustomerName(selected.customer.user.name || "");
      } else {
        setCustomerName("");
      }
    } else {
      setSelectedOrder(null);
      setCustomerName("");
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
      const response = await fetch(`${BASE_URL}/delivery-notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          order_id: selectedOrder.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update delivery note');
      }
      
      toast.success("Delivery note updated successfully");
      setTimeout(() => {
        onBackClick();
      }, 1500);
    } catch (error) {
      console.error("Error updating delivery note:", error);
      toast.error("Failed to update delivery note");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Delivery Note</CardTitle>
              <Form onSubmit={handleSubmit}>
                {/* Delivery Number (read-only) */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Delivery Number</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="delivery_number"
                      value={note?.delivery_number || ""}
                      readOnly
                    />
                  </Col>
                </Row>

                {/* Order (select dropdown) */}
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

                {/* Customer (auto-populated) */}
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

                {/* Delivery Date (editable) */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Delivery Date</Label>
                  <Col md={10}>
                    <Input
                      type="date"
                      name="delivery_date"
                      value={formData.delivery_date}
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Shipping Method (editable) */}
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

                {/* Tracking Number (editable) */}
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

                {/* Notes (editable) */}
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

                {/* Action Buttons */}
                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2" type="button">
                      Back
                    </Button>
                    <Button color="primary" type="submit">
                      Update Delivery Note
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

export default EditDeliveryNote;