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

function EditGenerateReport({ report, onBackClick }) {
  document.title = "Edit Report | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    template_id: report?.template?.id || "",
    report_name: report?.report_name || "",
    generated_by: report?.generated_by?.id || "",
    file_path: report?.file_path || ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch templates
        const templatesResponse = await fetch(`${BASE_URL}/report-templates`);
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData.data?.data || templatesData.data || []);

        // Fetch users
        const usersResponse = await fetch(`${BASE_URL}/users`);
        const usersData = await usersResponse.json();
        setUsers(usersData.data?.data || usersData.data || []);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Update the file path with the file name
      setFormData(prev => ({
        ...prev,
        file_path: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.report_name.trim()) {
      toast.error("Please enter a report name");
      setIsSubmitting(false);
      return;
    }
    
    if (!selectedFile && !report?.file_path) {
      toast.error("Please select a file to upload or keep existing file");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create form data for the request
      const formDataForRequest = new FormData();
      formDataForRequest.append('template_id', formData.template_id);
      formDataForRequest.append('report_name', formData.report_name);
      formDataForRequest.append('generated_by', formData.generated_by);
      
      // Only append the file if a new one was selected
      if (selectedFile) {
        formDataForRequest.append('file', selectedFile);
      }

      // First try with PUT method
      let response;
      try {
        response = await fetch(`${BASE_URL}/generated-reports/${report.id}`, {
          method: 'PUT',
          body: formDataForRequest,
        });
      } catch (putError) {
        // If PUT fails, try with POST and method override
        response = await fetch(`${BASE_URL}/generated-reports/${report.id}`, {
          method: 'POST',
          body: formDataForRequest,
          headers: {
            'X-HTTP-Method-Override': 'PUT'
          }
        });
      }

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      toast.success("Report updated successfully!");
      setTimeout(() => {
        onBackClick();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error(error.message || 'Error updating report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Report</CardTitle>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Template</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option 
                          key={template.id} 
                          value={template.id}
                        >
                          {template.template_name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Report Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="report_name"
                      value={formData.report_name}
                      onChange={handleChange}
                      placeholder="Enter report name"
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Generated By</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="generated_by"
                      value={formData.generated_by}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option 
                          key={user.id} 
                          value={user.id}
                        >
                          {user.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Current File</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="file_path"
                      value={formData.file_path}
                      onChange={handleChange}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Upload New File</Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    {selectedFile ? (
                      <div className="mt-2 text-muted">
                        Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </div>
                    ) : report?.file_path && (
                      <div className="mt-2 text-muted">
                        Current file: {report.file_path}
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
                      {isSubmitting ? 'Updating...' : 'Update Report'}
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

export default EditGenerateReport;