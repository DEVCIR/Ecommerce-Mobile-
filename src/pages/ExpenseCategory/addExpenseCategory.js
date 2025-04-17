import React, { useState } from "react";
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

function AddExpenseCategory({ onBackClick, setViewToTable }) {
  document.title = "Add Expense Category | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.category_name) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/expense-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success("Expense category created successfully");
        setTimeout(() => {
            setViewToTable(); 
          }, 1500);
      } else {
        const errorMessage = result.message || 
                           result.error || 
                           result.errors?.join(", ") || 
                           "Failed to create expense category";
        toast.error(errorMessage);
      }
      
    } catch (error) {
      console.error("Error creating expense category:", error);
      toast.error("Network error occurred while creating expense category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Expense Category</CardTitle>
              <Form>
                {/* Category Name */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Category Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="category_name"
                      value={formData.category_name}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      required
                    />
                  </Col>
                </Row>

                {/* Description */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Description</Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter description (optional)"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2">
                      Back
                    </Button>
                    <Button 
                      color="primary" 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
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

export default AddExpenseCategory;