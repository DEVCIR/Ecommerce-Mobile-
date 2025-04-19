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

function AddReportTemplate({ onBackClick }) {
  document.title = "Add Report Template | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('template_name', templateName);
      formData.append('description', description);
      formData.append('template_file', selectedFile);

      const response = await fetch(`${BASE_URL}/report-templates`, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create template');
      }

      const result = await response.json();
      
      toast.success("Report template created successfully!");
      setTimeout(() => {
        onBackClick();
      }, 1500);
      
    } catch (error) {
      console.error("Error creating report template:", error);
      toast.error(error.message || "Error creating report template");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Report Template</CardTitle>
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
                      required
                    />
                    {selectedFile && (
                      <div className="mt-2 text-muted">
                        Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </div>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2" type="button">
                      Back
                    </Button>
                    <Button color="primary" type="submit" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Save Template"}
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

export default AddReportTemplate;