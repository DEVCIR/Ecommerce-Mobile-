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

function AddCreditNoteItem({ props, onBackClick }) {
    document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Products", link: "#" },
        { title: "Add Product", link: "#" },
    ];

    const [formData, setFormData] = useState({
        credit_note_id: "",
        inventory_id: "",
        description: "",
        quantity: 1,
        unit_price: "",
        total_price: "",
        is_active: true,
    });
    const [creditNotes, setCreditNotes] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);


    const fetchCreditNotes = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/credit-notes");
            const result = await response.json();
            setCreditNotes(result.data.data);
        } catch (error) {
            console.error("Error fetching credit notes:", error);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/inventory");
            const result = await response.json();
            setInventoryItems(result.data.data);
        } catch (error) {
            console.error("Error fetching inventory items:", error);
        }
    };

    useEffect(() => {
        fetchCreditNotes();
        fetchInventoryItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare creditNoteItemData
        const creditNoteItemData = {
            credit_note_id: formData.credit_note_id,
            inventory_id: formData.inventory_id,
            description: formData.description,
            quantity: formData.quantity,
            unit_price: formData.unit_price,
            total_price: formData.total_price,
            is_active: formData.is_active,
        };

        try {
            // Post creditNoteItemData
            const response = await fetch("http://localhost:8000/api/credit-notes-item", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
                body: JSON.stringify(creditNoteItemData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Credit Note Item created successfully');
                onBackClick();
            } else {
                console.error("Error creating credit note item:", result);
                toast.error('Error creating credit note item. Please try again.');
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
                                <CardTitle className="h4">Add Credit Note Item</CardTitle>
                                <Button color="success" style={{ marginLeft: 2, padding: '5px 15px' }} onClick={onBackClick}>Back</Button>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                {/* Credit Note ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="credit_note_id" className="col-md-2 col-form-label">
                                        Credit Note ID
                                    </Label>
                                    <Col md={10}>
                                        <Select
                                            options={creditNotes.map(note => ({
                                                value: note.id,
                                                label: note.credit_note_number
                                            }))}
                                            onChange={(selectedOption) => setFormData({ ...formData, credit_note_id: selectedOption.value })}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Inventory ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="inventory_id" className="col-md-2 col-form-label">
                                        Inventory ID
                                    </Label>
                                    <Col md={10}>
                                        <Select
                                            options={inventoryItems.map(item => ({
                                                value: item.id,
                                                label: `${item.serial_no} - ${item.variant.product.brand.brand_name} ${item.variant.product.model_name}`
                                            }))}
                                            onChange={(selectedOption) => setFormData({ ...formData, inventory_id: selectedOption.value })}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Description */}
                                <Row className="mb-3">
                                    <Label htmlFor="description" className="col-md-2 col-form-label">
                                        Description
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>

                                {/* Quantity */}
                                <Row className="mb-3">
                                    <Label htmlFor="quantity" className="col-md-2 col-form-label">
                                        Quantity
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="quantity"
                                            id="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Unit Price */}
                                <Row className="mb-3">
                                    <Label htmlFor="unit_price" className="col-md-2 col-form-label">
                                        Unit Price
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="unit_price"
                                            id="unit_price"
                                            value={formData.unit_price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Total Price */}
                                <Row className="mb-3">
                                    <Label htmlFor="total_price" className="col-md-2 col-form-label">
                                        Total Price
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="total_price"
                                            id="total_price"
                                            value={formData.total_price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                {/* Is Active */}
                                <Row className="mb-3">
                                    <Label htmlFor="is_active" className="col-md-2 col-form-label">
                                        Is Active
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="checkbox"
                                            name="is_active"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                    </Col>
                                </Row>

                                {/* Submit Button */}
                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button type="submit" color="primary">
                                            Add Credit Note Item
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

export default connect(null, { setBreadcrumbItems })(AddCreditNoteItem);