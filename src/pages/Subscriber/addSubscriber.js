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

function AddSubscriber({ onBackClick, setViewToTable }) {
  document.title = "Add Subscriber | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    subscription_date: '',
  });

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); 
    setFormData(prev => ({
      ...prev,
      subscription_date: formattedDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      const payload = {
        ...formData,
        email: formData.email.trim(),
        subscription_date: formatDateForAPI(formData.subscription_date),
      };

      const response = await fetch("http://localhost:8000/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Subscriber added successfully");
      setTimeout(() => {
        setViewToTable();
      }, 1500);
      
    } catch (error) {
      console.error("Error adding subscriber:", error);
      toast.error("Failed to add subscriber");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Subscriber</CardTitle>
              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Row className="mb-3">
                  <Label htmlFor="email" className="col-md-2 col-form-label">
                    Email 
                  </Label>
                  <Col md={10}>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* First Name */}
                <Row className="mb-3">
                  <Label htmlFor="first_name" className="col-md-2 col-form-label">
                    First Name
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Last Name */}
                <Row className="mb-3">
                  <Label htmlFor="last_name" className="col-md-2 col-form-label">
                    Last Name
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Subscription Date */}
                <Row className="mb-3">
                  <Label htmlFor="subscription_date" className="col-md-2 col-form-label">
                    Subscription Date
                  </Label>
                  <Col md={10}>
                    <Input
                      type="datetime-local"
                      name="subscription_date"
                      id="subscription_date"
                      value={formData.subscription_date}
                      onChange={handleChange}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="button" color="secondary" onClick={onBackClick} className="me-2">
                      Back
                    </Button>
                    <Button type="submit" color="primary">
                      Add Subscriber
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

export default AddSubscriber;