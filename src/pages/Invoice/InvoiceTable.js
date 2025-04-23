import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Button, 
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";

const InvoiceTable = ({ }) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState({
    sending: false,
    success: false,
    error: null
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/invoices");
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data.data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const toggleEmailModal = () => setEmailModal(!emailModal);

  const handleSendEmailClick = (invoice) => {
    setCurrentInvoice(invoice);
    setEmail(invoice.customer.user.email); // Pre-fill with customer email
    setEmailModal(true);
    setEmailStatus({
      sending: false,
      success: false,
      error: null
    });
  };

  const handleSendEmail = async () => {
    if (!currentInvoice) return;

    setEmailStatus({
      sending: true,
      success: false,
      error: null
    });

    try {
      const response = await fetch(`http://localhost:8000/api/send-invoice-email/${currentInvoice.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }) // Send the email address in case you want to override
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailStatus({
        sending: false,
        success: true,
        error: null
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setEmailModal(false);
      }, 2000);
    } catch (err) {
      setEmailStatus({
        sending: false,
        success: false,
        error: err.message
      });
    }
  };

  const handleGenerateInvoice = async (invoice) => {
    try {
      const response = await fetch(`http://localhost:8000/api/order-items?order_id=${invoice.order_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order items");
      }
      const data = await response.json();
      
      const taxFixed = data.data.data[0]?.order?.tax_amount || 0;
      const invoiceItems = data.data.data.map(item => ({
        description: item.inventory.variant.product.model_name,
        qty: item.quantity,
        rate: item.unit_price,
        amount: parseFloat(item.total_price)
      }));
  
      navigate("/invoicetemplate", {
        state: {
          customerName: invoice.customer.user.name,
          customerEmail: invoice.customer.user.email,
          customerCity: invoice.customer.city,
          profilePicture: invoice.customer.user.profile_picture,
          invoiceNumber: invoice.invoice_number,
          invoiceDate: new Date(invoice.invoice_date).toLocaleDateString(),
          dueDate: new Date(invoice.due_date).toLocaleDateString(),
          items: invoiceItems,
          taxFixed: parseFloat(taxFixed)
        }
      });
    } catch (err) {
      console.error("Error fetching order items:", err);
      navigate("/invoicetemplate", {
        state: {
          customerName: invoice.customer.user.name,
          customerEmail: invoice.customer.user.email,
          customerCity: invoice.customer.city,
          invoiceNumber: invoice.invoice_number,
          invoiceDate: new Date(invoice.invoice_date).toLocaleDateString(),
          dueDate: new Date(invoice.due_date).toLocaleDateString(),
          items: [],
          taxFixed: 0
        }
      });
    }
  };

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <React.Fragment>
      <Row style={{ minHeight: '70vh' }}>
        <Col>
          <Card>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Col>
                  <CardTitle className="h4">Invoice Table</CardTitle>
                </Col>
                <Col style={{ display: 'flex' }} className="text-end">
                </Col>
              </div>
              
              <div className="table-rep-plugin">
                <div className="table-responsive mb-0">
                  <Table id="tech-companies-1" className="table table-striped table-bordered">
                    <Thead>
                      <Tr>
                        <Th>Invoice Number</Th>
                        <Th>Order Number</Th>
                        <Th>Customer Name</Th>
                        <Th>Customer Email</Th>
                        <Th>Customer City</Th>
                        <Th>Invoice Date</Th>
                        <Th>Due Date</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {invoices.map((invoice) => (
                        <Tr key={invoice.id}>
                          <Td>{invoice.invoice_number || "N/A"}</Td>
                          <Td>{invoice.order?.order_number || "N/A"}</Td>
                          <Td>{invoice.customer.user.name || "N/A"}</Td>
                          <Td>{invoice.customer.user.email || "N/A"}</Td>
                          <Td>{invoice.customer.city || "N/A"}</Td>
                          <Td>{new Date(invoice.invoice_date).toLocaleDateString()}</Td>
                          <Td>{new Date(invoice.due_date).toLocaleDateString()}</Td>
                          <Td>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <Button color="primary" onClick={() => handleGenerateInvoice(invoice)}>
                                Generate Template
                              </Button>
                              <Button color="success" onClick={() => handleSendEmailClick(invoice)}>
                                Send Email
                              </Button>
                            </div>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Email Modal */}
      <Modal isOpen={emailModal} toggle={toggleEmailModal}>
        <ModalHeader toggle={toggleEmailModal}>Send Invoice Email</ModalHeader>
        <ModalBody>
          {emailStatus.success ? (
            <Alert color="success">
              Email sent successfully!
            </Alert>
          ) : emailStatus.error ? (
            <Alert color="danger">
              Error: {emailStatus.error}
            </Alert>
          ) : (
            <Form>
              <FormGroup>
                <Label for="email">Recipient Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter recipient email"
                />
              </FormGroup>
              {currentInvoice && (
                <div style={{ marginTop: '15px' }}>
                  <p><strong>Invoice #:</strong> {currentInvoice.invoice_number}</p>
                  <p><strong>Customer:</strong> {currentInvoice.customer.user.name}</p>
                </div>
              )}
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          {!emailStatus.success && !emailStatus.error && (
            <>
              <Button color="secondary" onClick={toggleEmailModal}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onClick={handleSendEmail}
                disabled={emailStatus.sending}
              >
                {emailStatus.sending ? 'Sending...' : 'Send Email'}
              </Button>
            </>
          )}
          {(emailStatus.success || emailStatus.error) && (
            <Button color="secondary" onClick={toggleEmailModal}>
              Close
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default InvoiceTable;