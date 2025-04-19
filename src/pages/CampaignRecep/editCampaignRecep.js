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

function EditCampaignRecep({ onBackClick, recep }) {
  document.title = "View Campaign Recipient | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const [campaigns, setCampaigns] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);
  const [formData, setFormData] = useState({
    campaign_id: recep?.campaign?.id || "",
    subscriber_id: recep?.subscriber?.id || "",
    email_address: recep?.email_address || "",
    status: "Pending"
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/email-campaigns");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/campaign-recipients/${recep.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Recipient updated successfully");
      setTimeout(() => {
        onBackClick();
      }, 1500); 
    } catch (error) {
      console.error("Error updating recipient:", error);
      toast.error("Failed to update recipient");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Campaign Recipient</CardTitle>
              <Form onSubmit={handleSubmit}>
                
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Campaign</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="campaign_id"
                      value={formData.campaign_id}
                      onChange={handleInputChange}
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

                
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Subscriber</Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="subscriber_id"
                      value={formData.subscriber_id}
                      onChange={handleInputChange}
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

                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Email Address</Label>
                  <Col md={10}>
                    <Input
                      type="email"
                      name="email_address"
                      value={formData.email_address}
                      onChange={handleInputChange}
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

export default EditCampaignRecep;

