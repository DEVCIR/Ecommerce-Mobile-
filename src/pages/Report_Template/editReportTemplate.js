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

function EditReportTemplate({ template, onBackClick }) {
  document.title = "Edit Report Template | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [templateName, setTemplateName] = useState(template?.template_name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      setIsSubmitting(false);
      return;
    }
    
    if (!selectedFile && !template?.template_file_path) {
      toast.error("Please select a file to upload");
      setIsSubmitting(false);
      return;
    }

    try {
      if (!selectedFile) {
        const response = await fetch(`${BASE_URL}/report-templates/${template.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            template_name: templateName,
            description: description
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update template');
        }

        const result = await response.json();
        toast.success("Template updated successfully!");
        onBackClick();
        return;
      }

      const formData = new FormData();
      formData.append('template_name', templateName);
      formData.append('description', description);
      formData.append('template_file', selectedFile);

      let response;
      try {
       
        response = await fetch(`${BASE_URL}/report-templates/${template.id}`, {
          method: 'PUT',
          body: formData,
        });
      } catch (putError) {
        response = await fetch(`${BASE_URL}/report-templates/${template.id}`, {
          method: 'POST',
          body: formData,
          headers: {
           
            'X-HTTP-Method-Override': 'PUT'
          }
        });
      }

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      const result = await response.json();
      toast.success("Template updated successfully!");
      setTimeout(() => {
        onBackClick();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(error.message || "Failed to update template");
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
              <CardTitle className="h4">Edit Report Template</CardTitle>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Template Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="template_name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description (optional)"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Template File</Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      name="template_file"
                      onChange={handleFileChange}
                      accept=".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx"
                    />
                    {selectedFile ? (
                      <div className="mt-2 text-muted">
                        Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </div>
                    ) : template?.template_file_path && (
                      <div className="mt-2 text-muted">
                        Current file: {template.template_file_path}
                        <div className="text-info">(Leave empty to keep current file)</div>
                      </div>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button 
                      color="secondary" 
                      onClick={onBackClick} 
                      className="me-2" 
                      type="button"
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button 
                      color="primary" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Save Template'}
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

export default EditReportTemplate;