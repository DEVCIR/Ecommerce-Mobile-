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

function AddGenerateReport({ onBackClick, onReportGenerated }) {
  document.title = "Generate Report | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [formData, setFormData] = useState({
    template_id: "",
    report_name: "",
    generated_by: "",
    file_path: ""
  });
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
    const fetchData = async () => {
      try {
        
        const templatesResponse = await fetch(`${BASE_URL}/report-templates`);
        const templatesData = await templatesResponse.json();
        
       
        setTemplates(templatesData.data?.data || templatesData.data || []);
  
        
        const usersResponse = await fetch(`${BASE_URL}/users`);
        const usersData = await usersResponse.json();
        setUsers(usersData.data?.data || usersData.data || []);
  
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
        setTemplates([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.template_id) {
      toast.error("Please select a template");
      return;
    }
    
    if (!formData.report_name.trim()) {
      toast.error("Please enter a report name");
      return;
    }
    
    if (!formData.generated_by) {
      toast.error("Please select a user");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('template_id', formData.template_id);
      formDataToSend.append('report_name', formData.report_name);
      formDataToSend.append('generated_by', formData.generated_by);
      formDataToSend.append('generation_date', new Date().toISOString());
      formDataToSend.append('file', selectedFile);

      const response = await fetch(`${BASE_URL}/generated-reports`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Full error response:', errorData);
        throw new Error(errorData.message || 'Failed to generate report');
      }

      const result = await response.json();
      
      if (onReportGenerated) {
        onReportGenerated(result.data);
      }
      toast.success("Report generated successfully!");
      setTimeout(() => {
        onBackClick();
      }, 1500);
      
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Error generating report");
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
              <CardTitle className="h4">Generate New Report</CardTitle>
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
  {templates && templates.length > 0 ? (
    templates.map(template => (
      <option key={template.id} value={template.id}>
        {template.template_name}
      </option>
    ))
  ) : (
    <option disabled>No templates available</option>
  )}
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
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Report File</Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      name="report_file"
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
                    <Button color="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Generating..." : "Generate Report"}
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

export default AddGenerateReport;