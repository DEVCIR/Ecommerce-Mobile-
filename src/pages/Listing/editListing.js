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

function EditListing({ listingId, onBackClick }) {
    document.title = "Edit Listing | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Listings", link: "#" },
        { title: "Edit Listing", link: "#" },
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
    const [isLoading, setIsLoading] = useState(true);

    const fetchInitialData = async () => {
      try {
          setIsLoading(true);
          
          // Fetch marketplaces and products first
          const [marketplacesRes, productsRes] = await Promise.all([
              fetch(`${BASE_URL}/marketplaces`),
              fetch(`${BASE_URL}/products`)
          ]);
          
          const marketplacesData = await marketplacesRes.json();
          const productsData = await productsRes.json();
          
          // Handle both possible response structures
          setMarketplaces(marketplacesData.data?.data || marketplacesData.data || []);
          setProducts(productsData.data?.data || productsData.data || []);
  
          // Then fetch listing data if listingId exists
          if (listingId) {
              const listingRes = await fetch(`${BASE_URL}/listings/${listingId}`);
              if (!listingRes.ok) {
                  throw new Error('Failed to fetch listing');
              }
              
              const listingData = await listingRes.json();
              console.log('Full API Response:', listingData); 
              
              const listing = listingData.data?.data || listingData.data || listingData;
              
              if (!listing) {
                  throw new Error('No listing data found');
              }
              
              setFormData({
                  marketplace_id: listing.marketplace_id || "",
                  product_id: listing.product_id || "",
                  listing_reference: listing.listing_reference || "",
                  notes: listing.notes || "",
              });
          }
      } catch (error) {
          console.error("Error fetching data:", error);
          toast.error(`Failed to fetch data: ${error.message}`);
      } finally {
          setIsLoading(false);
      }
  };


  useEffect(() => {
    fetchInitialData();
}, [listingId]);

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
        
        try {
            const response = await fetch(`${BASE_URL}/listings/${listingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                
                 toast.success('Listing updated successfully', {
                                duration: 1500,
                                onAutoClose: () => {
                                    
                                    onBackClick();
                                }
                            });

            } else {
                throw new Error('Failed to update listing');
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            toast.error('Failed to update listing');
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <CardTitle className="h4">Edit Listing</CardTitle>
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
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default connect(null, { setBreadcrumbItems })(EditListing);