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

function AddSupplier({ onBackClick, setViewToTable }) {
  document.title = "Add Supplier | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    user_id: '',
    contact_person: '',
    address: '',
    tax_id: '',
    payment_terms: '',
    notes: ''
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users");
        const result = await response.json();
        if (result.data) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Log user_id when user is selected
    if (name === 'user_id') {
      console.log("Selected User ID:", value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.user_id) {
      toast.error("Please select a user");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Supplier added successfully");
      setTimeout(() => {
        setViewToTable();
      }, 1500);
      
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Failed to add supplier");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Supplier</CardTitle>
              <Form onSubmit={handleSubmit}>
                {/* User Selection */}
                <Row className="mb-3">
                  <Label htmlFor="user_id" className="col-md-2 col-form-label">
                    User
                  </Label>
                  <Col md={10}>
                    {loadingUsers ? (
                      <Input type="select" disabled>
                        <option>Loading users...</option>
                      </Input>
                    ) : (
                      <Input
                        type="select"
                        name="user_id"
                        id="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select User</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </option>
                        ))}
                      </Input>
                    )}
                  </Col>
                </Row>

                {/* Contact Person */}
                <Row className="mb-3">
                  <Label htmlFor="contact_person" className="col-md-2 col-form-label">
                    Contact Person
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="contact_person"
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Address */}
                <Row className="mb-3">
                  <Label htmlFor="address" className="col-md-2 col-form-label">
                    Address
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Tax ID */}
                <Row className="mb-3">
                  <Label htmlFor="tax_id" className="col-md-2 col-form-label">
                    Tax ID
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="tax_id"
                      id="tax_id"
                      value={formData.tax_id}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Payment Terms */}
                <Row className="mb-3">
                  <Label htmlFor="payment_terms" className="col-md-2 col-form-label">
                    Payment Terms
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="payment_terms"
                      id="payment_terms"
                      value={formData.payment_terms}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Notes */}
                <Row className="mb-3">
                  <Label htmlFor="notes" className="col-md-2 col-form-label">
                    Notes
                  </Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="notes"
                      id="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="button" color="secondary" onClick={onBackClick} className="me-2">
                      Back
                    </Button>
                    <Button type="submit" color="primary">
                      Add Supplier
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

export default AddSupplier;