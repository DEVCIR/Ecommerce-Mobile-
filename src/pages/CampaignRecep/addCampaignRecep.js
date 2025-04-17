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

function AddCampaignRecep({ onBackClick, setViewToTable }) {
  document.title = "Add Campaign Recipient | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const [formData, setFormData] = useState({
    campaign_id: "",
    subscriber_id: "",
    email_address: ""
  });

  const [campaigns, setCampaigns] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/email-campaigns");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Parse the campaigns data from the response
        if (data.data && Array.isArray(data.data.data)) {
          setCampaigns(data.data.data);
        } else {
          toast.error("Failed to load campaigns");
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Error loading campaigns");
      } finally {
        setIsLoadingCampaigns(false);
      }
    };

    const fetchSubscribers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/subscribers");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data.data)) {
          setSubscribers(data.data.data);
        } else {
          toast.error("Failed to load subscribers");
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        toast.error("Error loading subscribers");
      } finally {
        setIsLoadingSubscribers(false);
      }
    };

    fetchCampaigns();
    fetchSubscribers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Selected ${name}:`, value);
    
    if (name === "subscriber_id" && value) {
      const selectedSubscriber = subscribers.find(s => s.id.toString() === value);
      if (selectedSubscriber) {
        setFormData(prev => ({
          ...prev,
          subscriber_id: value,
          email_address: selectedSubscriber.email
        }));
        return;
      }
    }
    
    if (name === "campaign_id" && value) {
      console.log("Selected campaign ID:", value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.campaign_id) {
      toast.error("Please select a campaign");
      return;
    }
  
    if (!formData.subscriber_id) {
      toast.error("Please select a subscriber");
      return;
    }
  
    if (!formData.email_address) {
      toast.error("Please enter an email address");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch("http://localhost:8000/api/campaign-recipients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: parseInt(formData.campaign_id),
          subscriber_id: parseInt(formData.subscriber_id),
          email_address: formData.email_address
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to add campaign recipient");
      }
  
      toast.success("Campaign recipient added successfully");
      setTimeout(() => {
        setViewToTable();
      }, 1500);
      
    } catch (error) {
      console.error("Error adding campaign recipient:", error);
      toast.error(error.message || "Failed to add campaign recipient");
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
              <CardTitle className="h4">Add Campaign Recipient</CardTitle>
              <Form>
                {/* Campaign ID */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Campaign</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="campaign_id"
                      value={formData.campaign_id}
                      onChange={handleChange}
                      required
                      disabled={isLoadingCampaigns}
                    >
                      <option value="">Select a campaign</option>
                      {campaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.campaign_name}
                        </option>
                      ))}
                    </Input>
                    {isLoadingCampaigns && <small className="text-muted">Loading campaigns...</small>}
                    {!isLoadingCampaigns && campaigns.length === 0 && (
                      <small className="text-danger">No campaigns found</small>
                    )}
                  </Col>
                </Row>

                {/* Subscriber ID */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Subscriber</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="subscriber_id"
                      value={formData.subscriber_id}
                      onChange={handleChange}
                      required
                      disabled={isLoadingSubscribers}
                    >
                      <option value="">Select a subscriber</option>
                      {subscribers.map(subscriber => (
                        <option key={subscriber.id} value={subscriber.id}>
                          {subscriber.first_name}
                        </option>
                      ))}
                    </Input>
                    {isLoadingSubscribers && <small className="text-muted">Loading subscribers...</small>}
                    {!isLoadingSubscribers && subscribers.length === 0 && (
                      <small className="text-danger">No subscribers found</small>
                    )}
                  </Col>
                </Row>

                {/* Email Address */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Email Address</Label>
                  <Col md={10}>
                    <Input
                      type="email"
                      name="email_address"
                      value={formData.email_address}
                      onChange={handleChange}
                      placeholder="Enter email address"
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
                      disabled={isSubmitting || isLoadingCampaigns || isLoadingSubscribers}
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

export default AddCampaignRecep;