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

function EditRmaItem({ rma, onBackClick, setViewToTable }) {
  document.title = "Edit RMA | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [formData, setFormData] = useState({
    rma_id: "",
    inventory_id: "",
    quantity: 1,
    reason: "",
    condition_received: "",
    is_active: false
  });
  const [rmaList, setRmaList] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);

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

    const fetchRmaItem = async () => {
        console.log("RMA ITEM ID  ",rma);
      try {
        const response = await fetch(`http://localhost:8000/api/rma-items/?id=${rma.id}`);
        const data = await response.json();
        
        if (data && data.data && data.data.data.length > 0) {
          const rmaItem = data.data.data[0];
          setFormData({
            rma_id: rmaItem.rma_id,
            inventory_id: rmaItem.inventory_id,
            quantity: rmaItem.quantity,
            reason: rmaItem.reason,
            condition_received: rmaItem.condition_received,
            is_active: rmaItem.is_active
          });

          if (rmaItem.order) {
            setSelectedOrder(rmaItem.order);
            setCustomerName(rmaItem.customer?.user?.name || "");
          }
        }
      } catch (error) {
        console.error("Error fetching RMA item:", error);
      }
    };

    fetchRmaItem();
  }, [rma]);

  useEffect(() => {
    const fetchRmaData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/rmas`);
        const data = await response.json();
        
        if (data && data.data && data.data.data.length > 0) {
          setRmaList(data.data.data);
          setFormData(prev => ({
            ...prev,
            rma_id: data.data.data[0].id
          }));
        }
      } catch (error) {
        console.error("Error fetching RMA data:", error);
      }
    };

    fetchRmaData();
  }, []);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/inventory`);
        const data = await response.json();
        
        if (data && data.data && data.data.data.length > 0) {
          setInventoryList(data.data.data);
          setFormData(prev => ({
            ...prev,
            inventory_id: data.data.data[0].id
          }));
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
  }, []);

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
    
    if (!formData.rma_id) {
      alert("Please select an RMA item first");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/rma-items/${rma.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rma_id: formData.rma_id,
          inventory_id: formData.inventory_id,
          quantity: formData.quantity,
          reason: formData.reason,
          condition_received: formData.condition_received,
          is_active: formData.is_active
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update RMA item');
      }
  
      const data = await response.json();
      toast.success("RMA item updated successfully");
      setTimeout(() => {
        setViewToTable();
      }, 1500);
    } catch (error) {
      console.error("Error updating RMA item:", error);
      toast.error("Failed to update RMA item");
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
              <CardTitle className="h4">Edit RMA Item</CardTitle>
              <Form onSubmit={handleSubmit}>
              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">RMA ID</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="rma_id"
                      value={formData.rma_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, rma_id: e.target.value }))}
                      required
                    >
                      {rmaList.map(rma => (
                        <option key={rma.id} value={rma.id}>
                          {rma.rma_number}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Inventory ID</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="inventory_id"
                      value={formData.inventory_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, inventory_id: e.target.value }))}
                      required
                    >
                      {inventoryList.map(inventory => (
                        <option key={inventory.id} value={inventory.id}>
                          {inventory.variant.product.model_name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Quantity</Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
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
                  <Label className="col-md-2 col-form-label">Condition Received</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="condition_received"
                      placeholder="Enter condition received"
                      value={formData.condition_received}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>

                {/* <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Is Active</Label>
                  <Col md={10}>
                    <Input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                  </Col>
                </Row> */}

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2" type="button">
                      Back
                    </Button>
                    <Button color="primary" type="submit">
                      Update RMA Item
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

export default EditRmaItem;