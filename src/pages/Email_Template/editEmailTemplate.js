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

function EditEmailTemplate({ onBackClick, template }) {
  document.title = "Edit Email Template | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    template_name: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    if (template) {
      setFormData({
        template_name: template.template_name || '',
        subject: template.subject || '',
        content: template.content || ''
      });
    }
  }, [template]);

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
      const response = await fetch(`${BASE_URL}/email-templates/${template.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Email template updated successfully');
        setTimeout(() => {
            onBackClick();
          }, 1500);
      } else {
        toast.error(result.message || 'Failed to update email template');
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      toast.error('An error occurred while updating the email template');
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Email Template</CardTitle>
              <Form onSubmit={handleSubmit}>
             
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Template Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="template_name"
                      placeholder="Enter template name"
                      value={formData.template_name}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

            
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Subject</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="Enter email subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Content</Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="content"
                      rows="8"
                      placeholder="Enter email content"
                      value={formData.content}
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
                      Save
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

export default EditEmailTemplate;