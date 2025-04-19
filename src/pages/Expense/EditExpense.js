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

function EditExpense({ customerId, onBackClick }) {
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

    const fetchExpenseData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/expenses/${customerId}`);
            const result = await response.json();
            if (response.ok) {
                const expense = result;
                setFormData({
                    id: expense.id,
                    category_id: expense.category_id,
                    amount: expense.amount,
                    expense_date: expense.expense_date.split('T')[0],
                    description: expense.description,
                    payment_method: expense.payment_method,
                    reference_no: expense.reference_no,
                    recorded_by: expense.recorded_by.id,
                    is_active: expense.is_active,
                });
            } else {
                toast.error('Error fetching expense data. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching expense data:", error);
            toast.error('An error occurred while fetching expense data. Please try again.');
        }
    };

    useEffect(() => {
        fetchExpenseData();
        fetchCategories();
        fetchUsers();
    }, [customerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const expenseData = {
            category_id: formData.category_id, 
            amount: formData.amount, 
            expense_date: formData.expense_date, 
            description: formData.description, 
            payment_method: formData.payment_method, 
            reference_no: formData.reference_no, 
            recorded_by: formData.recorded_by, 
            is_active: formData.is_active, 
        };

        try {
            
            const response = await fetch(`${BASE_URL}/expenses/${formData.id}`, {
                method: "PUT", 
                headers: {
                    'Content-Type': 'application/json', 
                   
                },
                body: JSON.stringify(expenseData), 
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Expense updated successfully');
                onBackClick(); 
            } else {
                console.error("Error updating expense:", result);
                toast.error('Error updating expense. Please try again.');
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
                                {/* Category ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="category_id" className="col-md-2 col-form-label">
                                        Category
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="category_id"
                                            id="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Amount */}
                                <Row className="mb-3">
                                    <Label htmlFor="amount" className="col-md-2 col-form-label">
                                        Amount
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="amount"
                                            id="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Expense Date */}
                                <Row className="mb-3">
                                    <Label htmlFor="expense_date" className="col-md-2 col-form-label">
                                        Expense Date
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="date"
                                            name="expense_date"
                                            id="expense_date"
                                            value={formData.expense_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Recorded By */}
                                <Row className="mb-3">
                                    <Label htmlFor="recorded_by" className="col-md-2 col-form-label">
                                        Recorded By
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="recorded_by"
                                            id="recorded_by"
                                            value={formData.recorded_by}
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

                                {/* Submit Button */}
                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button type="submit" color="primary">
                                            Update Expense
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

export default connect(null, { setBreadcrumbItems })(EditExpense);