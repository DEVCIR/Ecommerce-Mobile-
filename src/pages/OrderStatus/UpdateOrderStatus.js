import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useParams, useNavigate } from "react-router-dom";
import {BASE_URL} from '../../Service';

const UpdateOrderStatus = (props) => {
  document.title = "Update Order Status | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const { id } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Tables", link: "#" },
    { title: "Update Order Status", link: "#" },
  ];

  const [formData, setFormData] = useState({
    status_name: "pending",
  });

  const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];

  useEffect(() => {
    props.setBreadcrumbItems("Update Order Status", breadcrumbItems);
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${BASE_URL}/order-statuses/${id}`, {
        headers: {
          "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
        },
      });
      const data = await response.json();
      setFormData({
        status_name: data.status_name || "pending",
      });
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/order-statuses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Order status updated successfully:", result);
      alert("Order status updated successfully!");
      navigate("/order-statuses");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Update Order Status</CardTitle>
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
                      Update Order Status
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
};

export default connect(null, { setBreadcrumbItems })(UpdateOrderStatus);