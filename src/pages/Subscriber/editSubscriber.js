import React, { useEffect, useState } from "react";
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
import {BASE_URL} from '../../Service';

function EditSubscriber({ subscriberId, onBackClick }) {
  document.title = "Edit Subscriber | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  const [subscriber, setSubscriber] = useState({
    email: '',
    first_name: '',
    last_name: '',
    subscription_date: ''
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const cleanedDate = dateString.split('.')[0];
    return cleanedDate.slice(0, 16); 
  };

  useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        const response = await fetch(`${BASE_URL}/subscribers/${subscriberId}`);
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result) {
          setSubscriber(result);
        }
      } catch (error) {
        console.error("Error fetching subscriber:", error);
      }
    };

    if (subscriberId) {
      fetchSubscriber();
    }
  }, [subscriberId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSubscriber(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/subscribers/${subscriberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriber),
      });

      if (response.ok) {
        toast.success('Subscriber updated successfully!');
        setTimeout(() => {
            onBackClick();
          }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Error updating subscriber: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast.error('Failed to update subscriber. Please try again.');
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Edit Subscriber</CardTitle>
              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Row className="mb-3">
                  <Label htmlFor="email" className="col-md-2 col-form-label">
                    Email 
                  </Label>
                  <Col md={10}>
                    <Input 
                      type="email" 
                      id="email" 
                      value={subscriber.email}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>

                {/* First Name */}
                <Row className="mb-3">
                  <Label htmlFor="first_name" className="col-md-2 col-form-label">
                    First Name
                  </Label>
                  <Col md={10}>
                    <Input 
                      type="text" 
                      id="first_name" 
                      value={subscriber.first_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>

                {/* Last Name */}
                <Row className="mb-3">
                  <Label htmlFor="last_name" className="col-md-2 col-form-label">
                    Last Name
                  </Label>
                  <Col md={10}>
                    <Input 
                      type="text" 
                      id="last_name" 
                      value={subscriber.last_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>

                {/* Subscription Date */}
                <Row className="mb-3">
                  <Label htmlFor="subscription_date" className="col-md-2 col-form-label">
                    Subscription Date
                  </Label>
                  <Col md={10}>
                    <Input 
                      type="datetime-local" 
                      id="subscription_date" 
                      value={formatDateForInput(subscriber.subscription_date)}
                      onChange={handleInputChange}
                      readOnly 
                    />
                  </Col>
                </Row>

                {/* Buttons */}
                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="button" color="secondary" onClick={onBackClick} className="me-2">
                      Back
                    </Button>
                    <Button type="submit" color="primary">
                      Update
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

export default EditSubscriber;