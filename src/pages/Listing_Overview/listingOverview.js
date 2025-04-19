import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "sonner";
import {BASE_URL} from '../../Service';
import { setNotifications } from "../../store/notification/actions";

const ListingOverview  = (props) => {
    document.title = "Listing Overview | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Tables", link: "#" },
        { title: "Listing Overview", link: "#" },
    ]

    const [listings, setListings] = useState([]);
    const [modal, setModal] = useState(false);
    const [currentListing, setCurrentListing] = useState(null);
    const [productNotifications, setProductNotifications] = useState({});

    const fetchListings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/listings`);
            const result = await response.json();
            setListings(result.data.data);
            
            checkForProductNotifications(result.data.data);
        } catch (error) {
            console.error("Error fetching listings data:", error);
            toast.error('Failed to fetch listings data');
        }
    };

    // const checkForProductNotifications = (listingsData) => {
    //     const productMap = {};
    //     const newNotifications = {};
        
    //     // Group listings by product ID
    //     listingsData.forEach(listing => {
    //         if (!listing.product?.id) return;
            
    //         if (!productMap[listing.product.id]) {
    //             productMap[listing.product.id] = [];
    //         }
    //         productMap[listing.product.id].push(listing);
    //     });
        
    //     // Check each product's listings
    //     Object.keys(productMap).forEach(productId => {
    //         const productListings = productMap[productId];
            
    //         // Only proceed if there are multiple listings
    //         if (productListings.length > 1) {
    //             const marketplaces = new Set();
    //             let hasSold = false;
    //             let hasListed = false;
                
    //             productListings.forEach(listing => {
    //                 marketplaces.add(listing.marketplace?.id);
    //                 if (listing.is_active) hasListed = true;
    //                 else hasSold = true;
    //             });
                
    //             // If there are listings in different marketplaces AND one is sold while others are listed
    //             if (marketplaces.size > 1 && hasSold && hasListed) {
    //                 const soldListing = productListings.find(l => !l.is_active);
    //                 const listedListings = productListings.filter(l => l.is_active);
                    
    //                 newNotifications[productId] = {
    //                     productName: productListings[0].product?.model_name || 'N/A',
    //                     soldMarketplace: soldListing.marketplace?.name || 'N/A',
    //                     listedMarketplaces: listedListings.map(l => l.marketplace?.name || 'N/A').join(', '),
    //                     soldListingId: soldListing.id
    //                 };
    //             }
    //         }
    //     });
        
    //     setProductNotifications(newNotifications);
    // };


    const checkForProductNotifications = (listingsData) => {
        const productMap = {};
        const newNotifications = {};
        
        // Group listings by product ID
        listingsData.forEach(listing => {
            if (!listing.product?.id) return;
            
            if (!productMap[listing.product.id]) {
                productMap[listing.product.id] = [];
            }
            productMap[listing.product.id].push(listing);
        });
        
        // Check each product's listings
        Object.keys(productMap).forEach(productId => {
            const productListings = productMap[productId];
            
            // Only proceed if there are multiple listings
            if (productListings.length > 1) {
                const marketplaces = new Set();
                let hasSold = false;
                let hasListed = false;
                
                productListings.forEach(listing => {
                    marketplaces.add(listing.marketplace?.id);
                    if (listing.is_active) hasListed = true;
                    else hasSold = true;
                });
                
                // If there are listings in different marketplaces AND one is sold while others are listed
                if (marketplaces.size > 1 && hasSold && hasListed) {
                    const soldListing = productListings.find(l => !l.is_active);
                    const listedListings = productListings.filter(l => l.is_active);
                    
                    newNotifications[productId] = {
                        productName: productListings[0].product?.model_name || 'N/A',
                        soldMarketplace: soldListing.marketplace?.name || 'N/A',
                        listedMarketplaces: listedListings.map(l => l.marketplace?.name || 'N/A').join(', '),
                        soldListingId: soldListing.id
                    };
                }
            }
        });
        
        // Dispatch notifications to Redux
        props.setNotifications(newNotifications);
        setProductNotifications(newNotifications);
    };

    const toggleModal = (listing = null) => {
        setCurrentListing(listing);
        setModal(!modal);
    };

    const handleStatusUpdate = async () => {
        if (!currentListing) return;
        
        try {
            const response = await fetch(`${BASE_URL}/listings/${currentListing.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_active: !currentListing.is_active
                })
            });
            
            if (response.ok) {
                toast.success('Listing status updated successfully');
                fetchListings(); // Refresh the listings which will also update notifications
            } else {
                throw new Error('Failed to update listing');
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            toast.error('Failed to update listing status');
        } finally {
            toggleModal(); // Close the modal
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Listing Overview', breadcrumbItems);
        fetchListings();
    }, [props]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Listings Overview</CardTitle>
                                </Col>
                            </div>

                            {/* Notifications for products with multiple listings */}
                            {Object.keys(productNotifications).length > 0 && (
                                <div className="mb-4">
                                    {Object.values(productNotifications).map((notification, index) => (
                                        <Alert color="warning" key={index}>
                                            <strong>Action Required:</strong> Remove product "{notification.productName}" 
                                            from marketplace: {notification.listedMarketplaces}. 
                                            This product is marked as Sold in {notification.soldMarketplace}.
                                        </Alert>
                                    ))}
                                </div>
                            )}

                            <div className="table-rep-plugin">
                                <div
                                    className="table-responsive mb-0"
                                    data-pattern="priority-columns"
                                >
                                    <Table
                                        id="tech-companies-1"
                                        className="table table-striped table-bordered"
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th>Product</Th>
                                                <Th>Marketplace</Th>
                                                <Th>Status</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {listings.map(listing => (
                                                <Tr key={listing.id}>
                                                    <Td>{listing.product?.model_name || 'N/A'}</Td>
                                                    <Td>{listing.marketplace?.name || 'N/A'}</Td>
                                                    <Td>
                                                        <span className={`badge bg-${listing.is_active ? 'success' : 'danger'}`}>
                                                            {listing.is_active ? 'Listed' : 'Sold'}
                                                        </span>
                                                    </Td>
                                                    <Td>
                                                        <Button 
                                                            color="primary"
                                                            onClick={() => toggleModal(listing)}
                                                        >
                                                            Sell Now
                                                        </Button>                                          
                                                    </Td>                                               
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Confirmation Modal */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Update Listing Status</ModalHeader>
                <ModalBody>
                    {currentListing && (
                        <div>
                            <p>Are you sure you want to mark this listing as {currentListing.is_active ? 'Sold' : 'Listed'}?</p>
                            <p><strong>Product:</strong> {currentListing.product?.model_name || 'N/A'}</p>
                            <p><strong>Marketplace:</strong> {currentListing.marketplace?.name || 'N/A'}</p>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    <Button color="primary" onClick={handleStatusUpdate}>
                        Confirm
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    )
}

// export default connect(null, { setBreadcrumbItems })(ListingOverview);
export default connect(null, { setBreadcrumbItems, setNotifications })(ListingOverview);