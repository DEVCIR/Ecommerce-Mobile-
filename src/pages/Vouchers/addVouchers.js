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


function AddVoucher({ props, onBackClick }) {
    document.title = "Add Voucher | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Vouchers", link: "#" },
        { title: "Add Voucher", link: "#" },
    ];

    const [formData, setFormData] = useState({
        voucher_code: "",
        voucher_secret_id: Math.floor(1000 + Math.random() * 9000), 
        discount_type: "percentage",
        voucher_discount: "",
        voucher_creator: "",
    });

    const [users, setUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/users');
            const result = await response.json();
            setUsers(result.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
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
        setIsSubmitting(true);
    
        const voucherData = {
            voucher_code: formData.voucher_code,
            voucher_secret_id: formData.voucher_secret_id,
            discount_type: formData.discount_type,
            voucher_discount: formData.voucher_discount,
            voucher_creator: formData.voucher_creator,
        };
    
        try {
            const response = await fetch('http://localhost:8000/api/voucher', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
                body: JSON.stringify(voucherData),
            });
    
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error creating voucher');
            }
    
            toast.success('Voucher created successfully', {
                duration: 1500,
                onAutoClose: () => {
                    onBackClick();
                }
            });
            
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                                <CardTitle className="h4">Add Voucher</CardTitle>
                                <Button color="success" style={{ marginLeft: 2, padding: '5px 15px' }} onClick={onBackClick}>Back</Button>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                {/* Voucher Code */}
                                <Row className="mb-3">
                                    <Label htmlFor="voucher_code" className="col-md-2 col-form-label">
                                        Voucher Code
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="voucher_code"
                                            id="voucher_code"
                                            value={formData.voucher_code}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter voucher code (e.g., SUMMER20)"
                                        />
                                    </Col>
                                </Row>

                                {/* Voucher Secret ID (read-only) */}
                                <Row className="mb-3">
                                    <Label htmlFor="voucher_secret_id" className="col-md-2 col-form-label">
                                        Secret ID
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="voucher_secret_id"
                                            id="voucher_secret_id"
                                            value={formData.voucher_secret_id}
                                            readOnly
                                        />
                                    </Col>
                                </Row>

                                {/* Discount Type */}
                                <Row className="mb-3">
                                    <Label htmlFor="discount_type" className="col-md-2 col-form-label">
                                        Discount Type
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="discount_type"
                                            id="discount_type"
                                            value={formData.discount_type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Voucher Discount */}
                                <Row className="mb-3">
                                    <Label htmlFor="voucher_discount" className="col-md-2 col-form-label">
                                        Discount Value
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="number"
                                            name="voucher_discount"
                                            id="voucher_discount"
                                            value={formData.voucher_discount}
                                            onChange={handleChange}
                                            required
                                            placeholder={formData.discount_type === 'percentage' ? 'Enter percentage (e.g., 20)' : 'Enter fixed amount'}
                                        />
                                    </Col>
                                </Row>

                                {/* Voucher Creator */}
                                <Row className="mb-3">
                                    <Label htmlFor="voucher_creator" className="col-md-2 col-form-label">
                                        Created By
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="voucher_creator"
                                            id="voucher_creator"
                                            value={formData.voucher_creator}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.role})
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Submit Button */}
                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button type="submit" color="primary" disabled={isSubmitting}>
                                            {isSubmitting ? 'Creating...' : 'Add Voucher'}
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

export default connect(null, { setBreadcrumbItems })(AddVoucher);