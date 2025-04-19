import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "sonner";
import {BASE_URL} from '../../Service';

const ListingTable = (props) => {
    document.title = "Listings Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Tables", link: "#" },
        { title: "Listings Table", link: "#" },
    ]

    const [listings, setListings] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchListings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/listings`);
            const result = await response.json();
            setListings(result.data.data);
        } catch (error) {
            console.error("Error fetching listings data:", error);
            toast.error('Failed to fetch listings data');
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Listings Table', breadcrumbItems);
        fetchListings();
    }, [props]);

    const onEdit = (listingId) => {
        props.onEditListing(listingId); 
    };

    const onDelete = async (listingId) => {
        if (!window.confirm('Are you sure you want to delete this listing and all its history?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`${BASE_URL}/listings/${listingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Listing and its history deleted successfully');
                fetchListings(); 
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete listing');
            }
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error('Failed to delete listing');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Listings Table</CardTitle>
                                </Col>
                                <div style={{ display: 'flex' }} className="text-end">
                                    <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={props.onAddListingClick}>Add Listing</Button>
                                </div>
                            </div>

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
                                                <Th>Marketplace</Th>
                                                <Th>Product</Th>
                                                <Th>Listing Reference</Th>
                                                <Th>Notes</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {listings.map(listing => (
                                                <Tr key={listing.id}>
                                                    <Td>{listing.marketplace.name}</Td>
                                                    <Td>{listing.product.model_name}</Td>
                                                    <Td>{listing.listing_reference || 'N/A'}</Td>
                                                    <Td>{listing.notes || 'N/A'}</Td>
                                                    <Td>
                                                        <Button color="primary" onClick={() => onEdit(listing.id)}>Edit</Button>
                                                        <Button 
                                                            color="danger" 
                                                            style={{ marginLeft: '5px' }}
                                                            onClick={() => onDelete(listing.id)}
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting ? 'Deleting...' : 'Delete'}
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
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(ListingTable);