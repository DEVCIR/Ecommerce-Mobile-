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
import {BASE_URL} from '../../Service';

function AddListing({ props, onBackClick }) {
    document.title = "Add Listing | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Listings", link: "#" },
        { title: "Add Listing", link: "#" },
    ];

    const [formData, setFormData] = useState({
        marketplace_id: "",
        product_id: "",
        listing_reference: "",
        notes: "",
    });

    const [marketplaces, setMarketplaces] = useState([]);
    const [products, setProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMarketplaces = async () => {
        try {
            const response = await fetch(`${BASE_URL}/marketplaces`);
            const result = await response.json();
            setMarketplaces(result.data.data);
        } catch (error) {
            console.error("Error fetching marketplaces:", error);
            toast.error('Failed to fetch marketplaces');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/products`);
            const result = await response.json();
            setProducts(result.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchMarketplaces();
        fetchProducts();
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
    
        const listingData = {
            marketplace_id: formData.marketplace_id,
            product_id: formData.product_id,
            listing_reference: formData.listing_reference,
            notes: formData.notes,
        };
    
        try {
            
            const listingResponse = await fetch(`${BASE_URL}/listings`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
                body: JSON.stringify(listingData),
            });
    
            const listingResult = await listingResponse.json();
            
            if (!listingResponse.ok) {
                throw new Error(listingResult.message || 'Error creating listing');
            }
    
            const newListingId = listingResult.data?.id || listingResult.id;
            
            if (!newListingId) {
                throw new Error('Failed to get new listing ID from response');
            }
    
            const historyData = {
                listing_id: newListingId,
                action: "Listing Created",  
                details: "Initial listing creation",  
                changed_by: 1, 
            };
    
            const historyResponse = await fetch("http://localhost:8000/api/listing-history", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer YOUR_TOKEN_HERE",
                },
                body: JSON.stringify(historyData),
            });
    
            if (!historyResponse.ok) {
                const historyResult = await historyResponse.json();
                throw new Error(historyResult.message || 'Error creating listing history');
            }
    
            toast.success('Listing and history created successfully', {
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
                                <CardTitle className="h4">Add Listing</CardTitle>
                                <Button color="success" style={{ marginLeft: 2, padding: '5px 15px' }} onClick={onBackClick}>Back</Button>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                {/* Marketplace ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="marketplace_id" className="col-md-2 col-form-label">
                                        Marketplace
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="marketplace_id"
                                            id="marketplace_id"
                                            value={formData.marketplace_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Marketplace</option>
                                            {marketplaces.map(marketplace => (
                                                <option key={marketplace.id} value={marketplace.id}>
                                                    {marketplace.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Product ID */}
                                <Row className="mb-3">
                                    <Label htmlFor="product_id" className="col-md-2 col-form-label">
                                        Product
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="select"
                                            name="product_id"
                                            id="product_id"
                                            value={formData.product_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.model_name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

                                {/* Listing Reference */}
                                <Row className="mb-3">
                                    <Label htmlFor="listing_reference" className="col-md-2 col-form-label">
                                        Listing Reference
                                    </Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="listing_reference"
                                            id="listing_reference"
                                            value={formData.listing_reference}
                                            onChange={handleChange}
                                            required
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
                                        <Button type="submit" color="primary" disabled={isSubmitting}>
                                            {isSubmitting ? 'Creating...' : 'Add Listing'}
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

export default connect(null, { setBreadcrumbItems })(AddListing);