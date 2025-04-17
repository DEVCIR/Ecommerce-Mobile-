import React, { useEffect, useState } from 'react'

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
    Form
} from "reactstrap"

import InvoiceTable from './InvoiceTable'
import CustomerTable from './CustomerTable';
import OrderCreditNote from './OrderCreditNote';

const CreditNoteAdmin = () => {
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [searchedInvoice, setSearchedInvoice] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/customers");
                if (!response.ok) {
                    throw new Error("Failed to fetch customers");
                }
                const data = await response.json();
                setCustomers(data.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchInvoices = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/invoices");
                if (!response.ok) {
                    throw new Error("Failed to fetch invoices");
                }
                const data = await response.json();
                setInvoices(data.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCustomers();
        fetchInvoices();
    }, []);

    const handleSearch = async () => {
        let apiUrl = "http://localhost:8000/api/invoices?";
        if (selectedCustomer) {
            apiUrl += `$email=${selectedCustomer}&`;
        }
        if (selectedInvoice) {
            apiUrl += `id=${selectedInvoice}`;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            console.log(data.data.data[0]);
            setSearchedInvoice(data.data.data)
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrintOrder = (order) => {
        setSelectedOrder(order);
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">Credit Note</CardTitle>
                            <p className="card-title-desc">
                                Search User Using Invoice / User Email
                            </p>

                            <Row className="mb-3">
                                <label
                                    htmlFor="customer-select"
                                    className="col-md-2 col-form-label"
                                >
                                    Customers Id
                                </label>
                                <div className="col-md-10">
                                    <select
                                        className="form-control"
                                        id="customer-select"
                                        onChange={(e) => setSelectedCustomer(e.target.value)}
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.user.email}>
                                                {customer.user.name} - {customer.user.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Row>
                            <Row className="mb-3">
                                <label
                                    htmlFor="invoice-select"
                                    className="col-md-2 col-form-label"
                                >
                                    Invoices
                                </label>
                                <div className="col-md-10">
                                    <select
                                        className="form-control"
                                        id="invoice-select"
                                        onChange={(e) => setSelectedInvoice(e.target.value)}
                                    >
                                        <option value="">Select Invoice</option>
                                        {invoices.map(invoice => (
                                            <option key={invoice.id} value={invoice.id}>
                                                {invoice.invoice_number} - {invoice.status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Row>
                            <Row className="mb-3">
                                <div className="col-md-10 offset-md-2">
                                    {selectedCustomer || selectedInvoice ? (
                                        <button className="btn btn-primary" onClick={handleSearch}>
                                            Search
                                        </button>
                                    ) : null}
                                </div>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {selectedOrder ? (
                <div>
                    <h5>Selected Order Details:</h5>
                    <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
                </div>
            ) : (
                <>
                    {searchedInvoice.length > 0 && (
                        <>
                            <CustomerTable customers={searchedInvoice} />
                            <InvoiceTable invoices={searchedInvoice} />
                            <OrderCreditNote ordersss={searchedInvoice} onPrintOrder={handlePrintOrder} />
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    )
}

export default CreditNoteAdmin