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
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import {BASE_URL} from '../../Service';

function AddOrderStatus({ setShowAddStatus }) {
  document.title = "Add Order Status | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    status_name: "pending",
  });

  const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/order-statuses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Order status added successfully:", result);
      alert("Order status added successfully!");
      setShowAddStatus(false);
    } catch (error) {
      console.error("Error adding order status:", error);
      alert("Error adding order status. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Order Status</CardTitle>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Label htmlFor="status_name" className="col-md-2 col-form-label">
                    Status
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="status_name"
                      id="status_name"
                      value={formData.status_name}
                      onChange={handleChange}
                      required
                    >
                      {allowedStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary">
                      Add Order Status
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

export default connect(null, { setBreadcrumbItems })(AddOrderStatus);