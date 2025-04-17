import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button, CardTitle, Table } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";

const SubscriberTable = (props) => {
    document.title = "Subscribers | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Subscribers", link: "#" },
    ]

    const [subscriberData, setSubscriberData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscriberData = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/subscribers");
          const result = await response.json();
          
          if (result.data && result.data.data && Array.isArray(result.data.data)) {
            setSubscriberData(result.data.data);
            console.log("Subscribers loaded:", result.data.data);
          } else {
            setSubscriberData([]);
            console.warn("Unexpected data format:", result);
          }
        } catch (error) {
          console.error("Error fetching subscriber data:", error);
          setSubscriberData([]);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        props.setBreadcrumbItems('Subscribers', breadcrumbItems);
        fetchSubscriberData();
    }, [props]);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return dateString; 
        }
    };

    const handleDelete = async (id) => {
        try {
          const response = await fetch(`http://localhost:8000/api/subscribers/${id}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            toast.success('Subscriber deleted successfully!');
            // Refresh the table data after deletion
            fetchSubscriberData();
          } else {
            const errorData = await response.json();
            toast.error(`Error deleting subscriber: ${errorData.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error("Error deleting subscriber:", error);
          toast.error('Failed to delete subscriber. Please try again.');
        }
      };

    return (
        <React.Fragment>
             <Toaster position="top-right" richColors />
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Subscribers</CardTitle>
                                </Col>
                                <Col style={{ display: 'flex' }} className="text-end">
                                    <Button color="success" onClick={props.onAddSubscriberClick}>
                                        Add Subscriber
                                    </Button>
                                </Col>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading subscribers...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Subscription Date</th>
                                                <th>Unsubscribe Token</th>
                                                <th>Last Contacted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscriberData.length > 0 ? (
                                                subscriberData.map(subscriber => (
                                                    <tr key={subscriber.id}>
                                                        <td>{displayField(subscriber.email)}</td>
                                                        <td>{displayField(subscriber.first_name)}</td>
                                                        <td>{displayField(subscriber.last_name)}</td>
                                                        <td>{formatDate(subscriber.subscription_date)}</td>
                                                        <td>{displayField(subscriber.unsubscribe_token)}</td>
                                                        <td>{formatDate(subscriber.last_contacted)}</td>
                                                        {/* <td>
                                                            <Button 
                                                                color="primary" 
                                                                onClick={() => props.onEditSubscriberClick(subscriber.id)}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </td> */}
                                                        <td>
  <Button 
    color="primary" 
    onClick={() => props.onEditSubscriberClick(subscriber.id)}
    className="me-2"
  >
    Edit
  </Button>
  <Button 
    color="danger" 
    onClick={() => handleDelete(subscriber.id)}
  >
    Delete
  </Button>
</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">No subscriber data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(SubscriberTable);