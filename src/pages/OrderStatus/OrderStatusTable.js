import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import AddOrderStatus from "./AddOrderStatus"; 
import { useNavigate } from "react-router-dom";
import {BASE_URL} from '../../Service';

const OrderStatusTable = (props) => {
  document.title = "Order Status Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState([]);
  const [showAddStatus, setShowAddStatus] = useState(false); 

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Tables", link: "#" },
    { title: "Order Status Table", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Order Status Table", breadcrumbItems);
    fetchStatuses();
  }, [showAddStatus]);

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/order-statuses`, {
        headers: {
          "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
        },
      });
      const data = await response.json();
      setStatuses(data.data);
    } catch (error) {
      console.error("Error fetching order statuses:", error);
      setStatuses([]); // fallback to empty array in case of error
    }
  };

  // Handle edit action
  const handleEdit = (statusId) => {
    navigate(`/update-order-statuses/${statusId}`);
  };

  // Handle delete action
  const handleDelete = async (statusId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order status?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/order-statuses/${statusId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
        },
      });

      if (response.ok) {
        alert("Order status deleted successfully!");
        fetchStatuses(); // Refresh the list
      } else {
        alert("Failed to delete order status. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting order status:", error);
      alert("An error occurred while deleting the order status.");
    }
  };

  const handleAddStatus = () => {
    setShowAddStatus(true); // Show the AddOrderStatus component
  };

  const handleBackToTable = () => {
    setShowAddStatus(false); // Return to the table view
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* Conditionally render the heading and button */}
              {!showAddStatus ? (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Order Status Table</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="success" onClick={handleAddStatus}>Add Order Status</Button>
                  </Col>
                </Row>
              ) : (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Add Order Status</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="secondary" onClick={handleBackToTable}>Back to Table</Button>
                  </Col>
                </Row>
              )}

              {/* Conditionally render the AddOrderStatus component or the table */}
              {showAddStatus ? (
                <AddOrderStatus setShowAddStatus={setShowAddStatus} />
              ) : (
                <div className="table-rep-plugin">
                  <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="order-status-table" className="table table-striped table-bordered">
                      <Thead>
                        <Tr>
                          <Th>Status Name</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {statuses.map((status) => (
                          <Tr key={status.id}>
                            <Td>{status.status_name}</Td>
                            <Td>
                              <Button color="primary" onClick={() => handleEdit(status.id)}>Edit</Button>{" "}
                              <Button color="danger" onClick={() => handleDelete(status.id)}>Delete</Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(OrderStatusTable);