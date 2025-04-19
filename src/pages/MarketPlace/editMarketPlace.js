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
import {BASE_URL} from '../../Service';

function EditMarketplaceItem({ onBackClick, item }) {
  document.title = "Edit Marketplace Item | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter a marketplace name");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/marketplaces/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update marketplace item');
      }

      toast.success("Marketplace item updated successfully");
      setTimeout(() => {
        onBackClick();
      }, 1500);
    } catch (error) {
      console.error('Error updating marketplace item:', error);
      toast.error("Failed to update marketplace item");
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
              <CardTitle className="h4">Edit Marketplace Item</CardTitle>
              <Form>
                {/* Name */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter marketplace name"
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

export default EditMarketplaceItem;