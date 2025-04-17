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
import { Toaster, toast } from "sonner";

function EditCreditNoteItem({ customerId, onBackClick }) {
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

    const [creditNotes, setCreditNotes] = useState([]);
    const [inventories, setInventories] = useState([]);

    const fetchCreditNotes = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/credit-notes");
            const result = await response.json();
            if (response.ok) {
                setCreditNotes(result.data.data);
            } else {
                toast.error('Error fetching credit notes. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching credit notes:", error);
            toast.error('An error occurred while fetching credit notes. Please try again.');
        }
    };

    const fetchInventories = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/inventory");
            const result = await response.json();
            if (response.ok) {
                setInventories(result.data.data);
            } else {
                toast.error('Error fetching inventory. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error('An error occurred while fetching inventory. Please try again.');
        }
    };

    const fetchCreditNoteItemData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/credit-notes-item/?id=${customerId}`);
            const result = await response.json();
            console.log(result)
            if (response.ok) {
                setFormData({
                    credit_note_id: result.data.data[0].credit_note_id || '',
                    inventory_id: result.data.data[0].inventory_id || '',
                    description: result.data.data[0].description || '',
                    quantity: result.data.data[0].quantity || 1,
                    unit_price: result.data.data[0].unit_price || '',
                    total_price: result.data.data[0].total_price || '',
                    is_active: result.data.data[0].is_active || true,
                });
            } else {
                toast.error('Error fetching credit note item data. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching credit note item data:", error);
            toast.error('An error occurred while fetching credit note item data. Please try again.');
        }
    };

    useEffect(() => {
        fetchCreditNoteItemData();
        fetchCreditNotes();
        fetchInventories();
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

        // Prepare creditNoteItemData
        const creditNoteItemData = {
            credit_note_id: formData.credit_note_id,
            inventory_id: formData.inventory_id,
            description: formData.description,
            quantity: parseInt(formData.quantity),
            unit_price: parseFloat(formData.unit_price),
            total_price: parseFloat(formData.total_price),
            is_active: formData.is_active,
        };

        try {
            // Update credit note item data
            const response = await fetch(`http://localhost:8000/api/credit-notes-item/${customerId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
                body: JSON.stringify(creditNoteItemData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Credit Note Item updated successfully');
                onBackClick();
            } else {
                console.error("Error updating credit note item:", result);
                toast.error('Error updating credit note item. Please try again.');
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
                                <CardTitle className="h4">Edit Credit Note Item</CardTitle>
                                <Button color="success" style={{ marginLeft: 2, padding: '5px 15px' }} onClick={onBackClick}>Back</Button>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                {/* Credit Note ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="credit_note_id" className="col-md-2 col-form-label">
                                        Credit Note ID
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="credit_note_id"
                                            id="credit_note_id"
                                            value={formData.credit_note_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Credit Note</option>
                                            {creditNotes.map(note => (
                                                <option key={note.id} value={note.id}>
                                                    {note.credit_note_number}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Inventory ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="inventory_id" className="col-md-2 col-form-label">
                                        Inventory ID
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="inventory_id"
                                            id="inventory_id"
                                            value={formData.inventory_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Inventory</option>
                                            {inventories.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.serial_no} - {item.variant.product.brand.brand_name} {item.variant.product.model_name}
                                                </option>
                                            ))}
                                        </Input>
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
                                            Update Credit Note Item
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

export default connect(null, { setBreadcrumbItems })(EditCreditNoteItem);