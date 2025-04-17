import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const InvoiceTable = ({ onAddInvoiceClick }) => {

    
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/invoices");
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data.data.data); // Access the nested data array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

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
                  <Button color="secondary" style={{ marginRight: 2, padding: '10px 0' }}>
                    Upload Invoice File
                  </Button>
                  {/* <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={onAddInvoiceClick}>
                    Add Invoice
                  </Button> */}
                </Col>
              </div>
              
              <div className="table-rep-plugin">
                <div className="table-responsive mb-0">
                  <Table id="tech-companies-1" className="table table-striped table-bordered">
                    <Thead>
                      <Tr>
                        <Th>Invoice Number</Th>
                        <Th>Order Number</Th>
                        <Th>Customer ID</Th>
                        <Th>Invoice Date</Th>
                        <Th>Due Date</Th>
                        <Th>Status</Th>
                        <Th>Template Used</Th>
                        <Th>Note</Th>
                        <Th>Created By</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {invoices.map((invoice) => (
                        <Tr key={invoice.id}>
                          <Td>{invoice.invoice_number}</Td>
                          <Td>{invoice.order?.order_number}</Td>
                          <Td>{invoice.customer_id}</Td>
                          <Td>{new Date(invoice.invoice_date).toLocaleDateString()}</Td>
                          <Td>{new Date(invoice.due_date).toLocaleDateString()}</Td>
                          <Td>{invoice.status}</Td>
                          <Td>{invoice.template_used}</Td>
                          <Td>{invoice.notes}</Td>
                          <Td>{invoice.created_by?.name}</Td>
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
    </React.Fragment>
  );
};

export default InvoiceTable;