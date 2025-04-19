import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  FormGroup,
  Form,
  Button,
  Table,
  Input,
} from "reactstrap"
import { Toaster, toast } from "sonner"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import GenerateCreditNote from "./generateCreditNote";

const CreditNoteModule = (props) => {
  document.title = "Credit Note | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Forms", link: "#" },
    { title: "Credit Note", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Credit Note', breadcrumbItems)
  })

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reasons, setReasons] = useState({}); 
  const [showCreditNote, setShowCreditNote] = useState(false);
  const [selectedItemsData, setSelectedItemsData] = useState([]);

  const handleGenerate = () => {
    // Prepare the selected items data before showing the credit note
    const itemsData = selectedItems.map(id => {
      const item = orderItems.find(item => item.inventory?.id === id);
      return {
        inventory_id: id,
        quantity: item?.quantity,
        reason: reasons[id] || "",
        product_name: item?.inventory?.variant?.product?.model_name,
        total_price: item?.total_price
      };
    });
    
    setSelectedItemsData(itemsData);
    setShowCreditNote(true);
  };

  const handleBack = () => {
    setShowCreditNote(false);
  };

  const handleSearch = async () => {
    if (!name && !email) {
      toast.error("Please enter either name or email to search");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/invoices?name=${name}&email=${email}`);
      const data = await response.json();
      
      if (data.data.data.length > 0) {
        setCustomerData(data.data.data);
        toast.success("Customer data found successfully!");

        const orderIds = data.data.data.map(invoice => invoice.order_id);
        const orderItemsPromises = orderIds.map(orderId => 
          fetch(`http://localhost:8000/api/order-items?order_id=${orderId}`).then(res => res.json())
        );

        const orderItemsResults = await Promise.all(orderItemsPromises);
        const allOrderItems = orderItemsResults.flatMap(result => result.data.data);
        setOrderItems(allOrderItems);
        setSelectedItems([]);
        setReasons({});
      } else {
        setCustomerData(null);
        setOrderItems([]);
        setSelectedItems([]);
        setReasons({});
        toast.error("No customer available with the provided information");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (inventoryId) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(inventoryId)) {
        const newReasons = {...reasons};
        delete newReasons[inventoryId];
        setReasons(newReasons);
        return prevSelected.filter(id => id !== inventoryId);
      } else {
        setReasons(prev => ({...prev, [inventoryId]: ""}));
        return [...prevSelected, inventoryId];
      }
    });
  };

  const handleReasonChange = (inventoryId, value) => {
    setReasons(prev => ({
      ...prev,
      [inventoryId]: value
    }));
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      {showCreditNote ? (
        <GenerateCreditNote 
          customerData={customerData} 
          selectedItems={selectedItemsData}
          onBack={handleBack}
        />
      ) : (
        <>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <label htmlFor="name-input" className="col-md-2 col-form-label">
                      Name
                    </label>
                    <div className="col-md-10">
                      <input
                        id="name-input"
                        className="form-control"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter customer name"
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label htmlFor="email-input" className="col-md-2 col-form-label">
                      Email
                    </label>
                    <div className="col-md-10">
                      <input
                        id="email-input"
                        className="form-control"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter customer email"
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <div className="col-md-10 offset-md-2">
                      <Button color="primary" onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {customerData && (
            <>
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <CardTitle>Invoices Detail</CardTitle>
                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Invoice Number</th>
                              <th>Total Amount</th>
                              <th>Discount Amount</th>
                              <th>Grand Total</th>
                              <th>Payment Method</th>
                              <th>Address</th>
                              <th>City</th>
                              <th>Country</th>
                              <th>Phone Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerData.map((invoice, index) => (
                              <tr key={`invoice-${index}`}>
                                <td>{invoice.customer.user.name}</td>
                                <td>{invoice.customer.user.email}</td>
                                <td>{invoice.invoice_number}</td>
                               <td>{invoice.order.total_amount}</td>
                                <td>{invoice.order.discount_amount}</td> 
                                <td>{invoice.order.grand_total}</td> 
                                <td>{invoice.order.payment_method}</td>
                                <td>{invoice.customer.address}</td>
                                <td>{invoice.customer.city}</td>
                                <td>{invoice.customer.country}</td>
                                <td>{invoice.customer.user.phone_number}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {orderItems.length > 0 && (
                <>
                  <Row className="mt-4">
                    <Col>
                      <Card>
                        <CardBody>
                          <CardTitle>Customer Order Details</CardTitle>
                          <div className="table-responsive">
                            <Table className="table mb-0">
                              <thead>
                                <tr>
                                  <th>Select</th>
                                  <th>Product Name</th>
                                  <th>Quantity</th>
                                  <th>Discount Amount</th>
                                  <th>Total Price</th>
                                  {selectedItems.length > 0 && <th>Reason</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {orderItems.map((item, index) => (
                                  <tr key={`item-${index}`}>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.inventory?.id)}
                                        onChange={() => handleCheckboxChange(item.inventory?.id)}
                                      />
                                    </td>
                                    <td>{item.inventory?.variant?.product?.model_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.discount_amount}</td>
                                    <td>{item.total_price}</td>
                                    {selectedItems.length > 0 && (
                                      <td>
                                        {selectedItems.includes(item.inventory?.id) ? (
                                          <Input
                                            type="text"
                                            value={reasons[item.inventory?.id] || ""}
                                            onChange={(e) => handleReasonChange(item.inventory?.id, e.target.value)}
                                            placeholder="Enter reason"
                                          />
                                        ) : null}
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  {selectedItems.length > 0 && (
                    <Row className="mt-3">
                      <Col>
                        <Button color="primary" onClick={handleGenerate}>
                          Generate Credit Note
                        </Button>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(CreditNoteModule);