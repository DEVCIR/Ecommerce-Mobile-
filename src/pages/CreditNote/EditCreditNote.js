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
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import Select from 'react-select';
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

function EditCreditNote({ customerId, creditNoteId, onBackClick }) {
    document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const [formData, setFormData] = useState({
        id: null,
        category_id: "",
        amount: "",
        expense_date: "",
        description: "",
        payment_method: "",
        reference_no: "",
        recorded_by: "",
        is_active: true,
    });

    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/expense-categories`);
            const result = await response.json();
            setCategories(result.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users`);
            const result = await response.json();
            setUsers(result.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/customers`);
            const result = await response.json();
            setCustomers(result.data.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchCreditNoteData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/credit-notes/${creditNoteId}`);
            const result = await response.json();
            if (response.ok) {
                const creditNote = result;
                setFormData({
                    credit_note_number: creditNote.credit_note_number,
                    rma_id: creditNote.rma_id,
                    customer_id: creditNote.customer_id,
                    issue_date: creditNote.issue_date.split('T')[0],
                    total_amount: creditNote.total_amount,
                    status: creditNote.status,
                    notes: creditNote.notes,
                    created_by: creditNote.created_by,
                    is_active: creditNote.is_active,
                });
            } else {
                toast.error('Error fetching credit note data. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching credit note data:", error);
            toast.error('An error occurred while fetching credit note data. Please try again.');
        }
    };

    useEffect(() => {
        fetchCreditNoteData();
        fetchCategories();
        fetchUsers();
        fetchCustomers();
    }, [customerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "profile_picture") {
            setFormData({
                ...formData,
                [name]: files[0], 
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const creditNoteData = {
            credit_note_number: formData.credit_note_number,
            rma_id: formData.rma_id,
            customer_id: formData.customer_id,
            issue_date: formData.issue_date,
            total_amount: formData.total_amount,
            status: formData.status,
            notes: formData.notes,
            created_by: formData.created_by,
            is_active: formData.is_active,
        };

        try {
            
            const response = await fetch(`${BASE_URL}/credit-notes/${creditNoteId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
                body: JSON.stringify(creditNoteData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Credit Note updated successfully');
                onBackClick();
            } else {
                console.error("Error updating credit note:", result);
                toast.error('Error updating credit note. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <React.Fragment>
            <Toaster position="top-right" richColors />
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px' }}>
                                <CardTitle className="h4">Edit Customer</CardTitle>
                                <Button color="success" style={{ marginLeft: 2, padding: '5px 15px' }} onClick={onBackClick}>Back</Button>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                
                                <Row className="mb-3">
                                    <Label htmlFor="credit_note_number" className="col-md-2 col-form-label">
                                        Credit Note Number
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="credit_note_number"
                                            id="credit_note_number"
                                            value={formData.credit_note_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                               
                                <Row className="mb-3">
                                    <Label htmlFor="rma_id" className="col-md-2 col-form-label">
                                        RMA ID
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="rma_id"
                                            id="rma_id"
                                            value={formData.rma_id}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                               
                                <Row className="mb-3">
                                    <Label htmlFor="customer_id" className="col-md-2 col-form-label">
                                        Customer
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="customer_id"
                                            id="customer_id"
                                            value={formData.customer_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Customer</option>
                                            {customers.map(customer => (
                                                <option key={customer.id} value={customer.id}>
                                                    {customer.user.name} {customer.user.last_name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                             
                                <Row className="mb-3">
                                    <Label htmlFor="issue_date" className="col-md-2 col-form-label">
                                        Issue Date
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="date"
                                            name="issue_date"
                                            id="issue_date"
                                            value={formData.issue_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                              
                                <Row className="mb-3">
                                    <Label htmlFor="total_amount" className="col-md-2 col-form-label">
                                        Total Amount
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="total_amount"
                                            id="total_amount"
                                            value={formData.total_amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                              
                                <Row className="mb-3">
                                    <Label htmlFor="status" className="col-md-2 col-form-label">
                                        Status
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="status"
                                            id="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Issued">Issued</option>
                                            <option value="Applied">Applied</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </Input>
                                    </Col>
                                </Row>

                              
                                <Row className="mb-3">
                                    <Label htmlFor="notes" className="col-md-2 col-form-label">
                                        Notes
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="textarea"
                                            name="notes"
                                            id="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                
                                <Row className="mb-3">
                                    <Label htmlFor="created_by" className="col-md-2 col-form-label">
                                        Created By
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="created_by"
                                            id="created_by"
                                            value={formData.created_by}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} {user.last_name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                                
                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button type="submit" color="primary">
                                            Update Credit Note
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
};

export default connect(null, { setBreadcrumbItems })(EditCreditNote);