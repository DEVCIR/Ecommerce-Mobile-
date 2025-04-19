import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  FormGroup,
  Form,
  Label,
  Button,
  Badge
} from "reactstrap"
import Select from 'react-select';
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import {Toaster, toast} from "sonner";

const ListingModule = (props) => {
  document.title = "Listing Module | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Forms", link: "#" },
    { title: "Listing Module", link: "#" },
  ]

  const [products, setProducts] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [marketplacesLoading, setMarketplacesLoading] = useState(true);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState({});

  useEffect(() => {
    props.setBreadcrumbItems('Listing Module', breadcrumbItems);
    fetchProducts();
    fetchMarketplaces();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      
      if (data.data && data.data.data) {
        const productOptions = data.data.data
          .filter(product => product.is_active === true) 
          .map(product => ({
            value: product.id,
            label: product.model_name
          }));
        setProducts(productOptions);
      }
      setProductsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsLoading(false);
    }
  };

  const fetchMarketplaces = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/marketplaces');
      const data = await response.json();
      
      if (data.data && data.data.data) {
        const marketplaceOptions = data.data.data.map(marketplace => ({
          value: marketplace.id,
          label: marketplace.name
        }));
        setMarketplaces(marketplaceOptions);
      }
      setMarketplacesLoading(false);
    } catch (error) {
      console.error('Error fetching marketplaces:', error);
      setMarketplacesLoading(false);
    }
  };

  const handleProductChange = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
    
    const newSelectedMarketplaces = {...selectedMarketplaces};
    selectedOptions.forEach(product => {
      if (!newSelectedMarketplaces[product.value]) {
        newSelectedMarketplaces[product.value] = [];
      }
    });
    setSelectedMarketplaces(newSelectedMarketplaces);
  };

  const handleMarketplaceChange = (productId, selectedOptions) => {
    setSelectedMarketplaces(prev => ({
      ...prev,
      [productId]: selectedOptions
    }));
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.value !== productId));
    setSelectedMarketplaces(prev => {
      const newSelected = {...prev};
      delete newSelected[productId];
      return newSelected;
    });
  };

  const handleRemoveMarketplace = (productId, marketplaceId) => {
    setSelectedMarketplaces(prev => ({
      ...prev,
      [productId]: prev[productId].filter(m => m.value !== marketplaceId)
    }));
  };

  const handleListNow = async (productId) => {
    const productMarketplaces = selectedMarketplaces[productId] || [];
    
    if (productMarketplaces.length === 0) {
        toast.warning("Please select at least one marketplace for this product")
      return;
    }

    try {
      // Create an array of listing objects to post
      const listings = productMarketplaces.map(marketplace => ({
        product_id: productId,
        marketplace_id: marketplace.value
      }));

      // Send POST request for each listing
      const responses = await Promise.all(
        listings.map(listing => 
          fetch('http://localhost:8000/api/listings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(listing)
          })
        )
      );

      // Check if all responses are successful
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        toast.success("Listings created successfully!")
        handleRemoveProduct(productId);
      } else {
        toast.error("Some listings failed to create. Please try again.")
      }
    } catch (error) {
      console.error('Error creating listings:', error);
      toast.error("An error occurred while creating listings. Please try again.")
    }
  };

  // Custom styles for scrollable dropdown
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
  };

  return (
    <React.Fragment>
        <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Product Selection</CardTitle>
              <p className="card-title-desc">
                Select multiple products from the dropdown below.
              </p>

              <Form>
                <FormGroup>
                  <Label>Select Products</Label>
                  <Select
                    isMulti
                    options={products}
                    value={selectedProducts}
                    onChange={handleProductChange}
                    isLoading={productsLoading}
                    placeholder={productsLoading ? "Loading products..." : "Select products..."}
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {selectedProducts.map(product => (
          <Col md="6" key={product.value} className="mb-4">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>{product.label}</h5>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => handleRemoveProduct(product.value)}
                  >
                    Remove Product
                  </Button>
                </div>
                
                <FormGroup>
                  <Label>Select Marketplaces for {product.label}</Label>
                  <Select
                    isMulti
                    options={marketplaces}
                    value={selectedMarketplaces[product.value] || []}
                    onChange={(selected) => handleMarketplaceChange(product.value, selected)}
                    isLoading={marketplacesLoading}
                    placeholder={marketplacesLoading ? "Loading marketplaces..." : "Select marketplaces..."}
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                </FormGroup>

                <Button 
                  color="primary" 
                  className="mt-3"
                  onClick={() => handleListNow(product.value)}
                >
                  List Now
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(ListingModule);



