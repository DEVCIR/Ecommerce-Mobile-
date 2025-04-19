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

function EditEmailCampaign({ onBackClick, campaign = null }) {
  document.title = "Edit Email Campaign | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const currentDateTime = new Date().toISOString().slice(0, 16);
  
  const [formData, setFormData] = useState({
    template_id: campaign?.template_id || "",
    campaign_name: campaign?.campaign_name || "",
    subject: campaign?.subject || "",
    content: campaign?.content || "",
    scheduled_time: campaign?.scheduled_time ? new Date(campaign.scheduled_time).toISOString().slice(0, 16) : currentDateTime,
    created_by: campaign?.created_by?.id || ""
  });

  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        template_id: campaign.template_id || "",
        campaign_name: campaign.campaign_name || "",
        subject: campaign.subject || "",
        content: campaign.content || "",
        scheduled_time: campaign.scheduled_time 
          ? new Date(campaign.scheduled_time).toISOString().slice(0, 16)
          : currentDateTime,
        created_by: campaign.created_by?.id || ""
      });
    }
  }, [campaign]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/email-templates`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setTemplates(data.data);
        } else {
          toast.error("Failed to load templates");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Error loading templates");
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && Array.isArray(data.data)) {
          const formattedUsers = data.data.map(user => ({
            id: user.id,
            displayName: user.name || user.email 
          }));
          setUsers(formattedUsers);
        } else {
          toast.error("Failed to load users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error loading users");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchTemplates();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "template_id") {
      if (value) {
        const selectedTemplate = templates.find(t => t.id.toString() === value);
        if (selectedTemplate) {
          setFormData(prev => ({
            ...prev,
            template_id: value,
            subject: selectedTemplate.subject,
            content: selectedTemplate.content
          }));
          return;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!campaign?.id) {
      toast.error("No campaign ID found for update");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/email-campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: formData.template_id,
          campaign_name: formData.campaign_name,
          subject: formData.subject,
          content: formData.content,
          scheduled_time: formData.scheduled_time,
          created_by: formData.created_by
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update campaign');
      }

      toast.success('Email campaign updated successfully');
      setTimeout(() => {
        onBackClick();
      }, 1500); 
    } catch (error) {
      console.error('Error updating email campaign:', error);
      toast.error(error.message || 'An error occurred while updating the email campaign');
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
              <CardTitle className="h4">Edit Email Campaign</CardTitle>
              <Form>
                
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Template</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleChange}
                      required
                      disabled={isLoadingTemplates}
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.template_name}
                        </option>
                      ))}
                    </Input>
                    {isLoadingTemplates && <small className="text-muted">Loading templates...</small>}
                  </Col>
                </Row>

              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Campaign Name</Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="campaign_name"
                      value={formData.campaign_name}
                      onChange={handleChange}
                      placeholder="Enter campaign name"
                      required
                    />
                  </Col>
                </Row>

              
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
                  <Label className="col-md-2 col-form-label">Scheduled Time</Label>
                  <Col md={10}>
                    <Input
                      type="datetime-local"
                      name="scheduled_time"
                      value={formData.scheduled_time}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

              
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">User</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="created_by"
                      value={formData.created_by}
                      onChange={handleChange}
                      required
                      disabled={isLoadingUsers}
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.displayName}
                        </option>
                      ))}
                    </Input>
                    {isLoadingUsers && <small className="text-muted">Loading users...</small>}
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

export default EditEmailCampaign;