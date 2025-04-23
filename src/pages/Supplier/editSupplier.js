import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Toaster, toast } from "sonner";


function EditSupplier({ onBackClick, setViewToTable, supplierId }) {
  document.title = "EditSupplier | Lexa - Responsive Bootstrap 5 Admin Dashboard";

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
  const [loadingSupplier, setLoadingSupplier] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('http://localhost:8000/api/users');
        const usersResult = await usersResponse.json();
        console.log("Users response:", usersResult);

        if (!usersResponse.ok) throw new Error(usersResult.message || 'Failed to fetch users');
        setUsers(usersResult.data || usersResult || []);

        // Fetch supplier data if supplierId exists
        if (supplierId) {
          console.log(`Fetching supplier ${supplierId}...`);
          const supplierResponse = await fetch(`http://localhost:8000/api/suppliers/${supplierId}`);
          const supplierResult = await supplierResponse.json();
          console.log("Supplier response:", supplierResult);

          if (!supplierResponse.ok) throw new Error(supplierResult.message || 'Failed to fetch supplier');

          const supplierData = supplierResult.data?.data || supplierResult.data || supplierResult;
          console.log("Extracted supplier data:", supplierData);

          if (supplierData) {
            setFormData({
              user_id: supplierData.user_id?.toString() || '',
              contact_person: supplierData.contact_person || '',
              address: supplierData.address || '',
              tax_id: supplierData.tax_id || '',
              payment_terms: supplierData.payment_terms || '',
              notes: supplierData.notes || ''
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoadingUsers(false);
        setLoadingSupplier(false);
      }
    };
    
    fetchData();
  }, [supplierId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Supplier updated successfully");
        setViewToTable();
      } else {
        toast.error(result.message || "Failed to update supplier");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("An error occurred while updating supplier");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Supplier</CardTitle>
              {loadingSupplier ? (
                <div>Loading supplier data...</div>
              ) : (
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
                        Update Supplier
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default EditSupplier;