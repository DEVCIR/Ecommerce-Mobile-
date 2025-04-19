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
import {BASE_URL} from '../../Service';

function EditExpenseCategory({ onBackClick, category }) {
  document.title = "Edit Expense Category | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || '',
        description: category.description || '',
      });
    }
  }, [category]);

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
      const response = await fetch(`${BASE_URL}/expense-categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Expense category updated successfully');
        setTimeout(() => {
            onBackClick();
          }, 1500); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update expense category');
      }
    } catch (error) {
      console.error('Error updating expense category:', error);
      toast.error('An error occurred while updating the expense category');
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Expense Category</CardTitle>
              <Form onSubmit={handleSubmit}>
                
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Category Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="category_name"
                      placeholder="Enter category name"
                      value={formData.category_name}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Description</Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="description"
                      rows="4"
                      placeholder="Enter description (optional)"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2">
                      Back
                    </Button>
                    <Button color="primary" type="submit">
                      Save Changes
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

export default EditExpenseCategory;