import React, { useState, useEffect } from "react";

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
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



function AddBuyers({ props, onBackClick }) {
    document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Products", link: "#" },
        { title: "Add Product", link: "#" },
    ];



    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        last_name: "",
        phone_number: "",
        role: "customer",
        profile_picture: null,
        address: "",
        city: "",
        country: "",
        postal_code: "",
        tax_id: "",
        customer_type: "Retail",
        credit_limit: "",
        notes: "",
        is_active: true,
    });


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

        // Prepare userData
        const userData = new FormData(); // Use FormData to handle file uploads
        userData.append('name', formData.name);
        userData.append('email', formData.email);
        userData.append('password', formData.password);
        userData.append('last_name', formData.last_name);
        userData.append('phone_number', formData.phone_number);
        userData.append('role', formData.role);

        // Append profile picture if it exists
        if (formData.profile_picture) {
            userData.append('profile_picture', formData.profile_picture); // Add the file to FormData
        }

        // Prepare customerData
        const customerData = {
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postal_code,
            tax_id: formData.tax_id,
            customer_type: formData.customer_type,
            credit_limit: formData.credit_limit,
            notes: formData.notes,
            is_active: formData.is_active,
        };

        try {
            // Post userData
            const userResponse = await fetch(`${BASE_URL}/users`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: userData, 
            });

            const userResult = await userResponse.json();
            if (userResponse.ok) {
                toast.success('User created successfully');

                // Add user_id to customerData
                customerData.user_id = userResult.user.id; // Assuming the user ID is in userResult.user.id

                // Post customerData after user creation
                const customerResponse = await fetch(`${BASE_URL}/customers`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json', // Set content type to JSON
                        'Authorization': "Bearer YOUR_TOKEN_HERE", // Update with your token
                    },
                    body: JSON.stringify(customerData), // Convert customerData to JSON
                });

                const customerResult = await customerResponse.json();
                if (customerResponse.ok) {
                    toast.success('Customer data added successfully');
                    onBackClick();
                } else {
                    console.error("Error creating customer:", customerResult);
                    toast.error('Error creating customer. Please try again.');
                }
            } else {
                console.error("Error creating user:", userResult);
                toast.error('Error creating user. Please try again.');
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
                                <CardTitle className="h4">Add Customer</CardTitle>
                                <Button color="success" style={{ marginLeft: 2, padding: '5px 15px' }} onClick={onBackClick}>Back</Button>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                {/* Name */}
                                <Row className="mb-3">
                                    <Label htmlFor="name" className="col-md-2 col-form-label">
                                        Name
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Email */}
                                <Row className="mb-3">
                                    <Label htmlFor="email" className="col-md-2 col-form-label">
                                        Email
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Password */}
                                <Row className="mb-3">
                                    <Label htmlFor="password" className="col-md-2 col-form-label">
                                        Password
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
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
                                            name="last_name"
                                            id="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Phone Number */}
                                <Row className="mb-3">
                                    <Label htmlFor="phone_number" className="col-md-2 col-form-label">
                                        Phone Number
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="phone_number"
                                            id="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                           

                                {/* Profile Picture */}
                                <Row className="mb-3">
                                    <Label htmlFor="profile_picture" className="col-md-2 col-form-label">
                                        Profile Picture
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="file"
                                            name="profile_picture"
                                            id="profile_picture"
                                            onChange={handleFileChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Address */}
                                <Row className="mb-3">
                                    <Label htmlFor="address" className="col-md-2 col-form-label">
                                        Address
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* City */}
                                <Row className="mb-3">
                                    <Label htmlFor="city" className="col-md-2 col-form-label">
                                        City
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="city"
                                            id="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Country */}
                                <Row className="mb-3">
                                    <Label htmlFor="country" className="col-md-2 col-form-label">
                                        Country
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="country"
                                            id="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Postal Code */}
                                <Row className="mb-3">
                                    <Label htmlFor="postal_code" className="col-md-2 col-form-label">
                                        Postal Code
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="postal_code"
                                            id="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Tax ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="tax_id" className="col-md-2 col-form-label">
                                        Tax ID
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="tax_id"
                                            id="tax_id"
                                            value={formData.tax_id}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Customer Type */}
                                <Row className="mb-3">
                                    <Label htmlFor="customer_type" className="col-md-2 col-form-label">
                                        Customer Type
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="customer_type"
                                            id="customer_type"
                                            value={formData.customer_type}
                                            onChange={handleChange}
                                        >
                                            <option value="Retail">Retail</option>
                                            <option value="Wholesale">Wholesale</option>
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Credit Limit */}
                                <Row className="mb-3">
                                    <Label htmlFor="credit_limit" className="col-md-2 col-form-label">
                                        Credit Limit
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="credit_limit"
                                            id="credit_limit"
                                            value={formData.credit_limit}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Notes */}
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

                                {/* Submit Button */}
                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button type="submit" color="primary">
                                            Add User
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

export default connect(null, { setBreadcrumbItems })(AddBuyers);