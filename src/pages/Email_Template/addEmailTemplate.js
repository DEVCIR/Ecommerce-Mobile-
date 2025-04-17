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

function AddEmailTemplate({ onBackClick, setViewToTable }) {
  document.title = "Add Email Template | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const [formData, setFormData] = useState({
    template_name: "",
    subject: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.template_name) {
      toast.error("Please enter a template name");
      return;
    }

    if (!formData.subject) {
      toast.error("Please enter a subject");
      return;
    }

    if (!formData.content) {
      toast.error("Please enter content");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/email-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Email template created successfully");
        setTimeout(() => {
          setViewToTable();
        }, 1500);
      } else {
        toast.error(result.message || "Failed to create email template");
      }
      
    } catch (error) {
      console.error("Error creating email template:", error);
      toast.error("Failed to create email template");
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
              <CardTitle className="h4">Add Email Template</CardTitle>
              <Form>
                {/* Template Name */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Template Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="template_name"
                      value={formData.template_name}
                      onChange={handleChange}
                      placeholder="Enter template name"
                      required
                    />
                  </Col>
                </Row>

                {/* Subject */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Subject</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter email subject"
                      required
                    />
                  </Col>
                </Row>

                {/* Content */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Content</Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="8"
                      placeholder="Enter email content"
                      required
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

export default AddEmailTemplate;