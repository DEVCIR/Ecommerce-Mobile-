import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "sonner";

const VouchersTable = (props) => {
    document.title = "Vouchers | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Vouchers", link: "#" },
        { title: "Vouchers Table", link: "#" },
    ]

    const [vouchers, setVouchers] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchVouchers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/voucher');
            const result = await response.json();
            setVouchers(result);
        } catch (error) {
            console.error("Error fetching vouchers data:", error);
            toast.error('Failed to fetch vouchers data');
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Vouchers Table', breadcrumbItems);
        fetchVouchers();
    }, [props]);

    const onDelete = async (voucherId) => {
        if (!window.confirm('Are you sure you want to delete this voucher?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:8000/api/voucher/${voucherId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Voucher deleted successfully');
                fetchVouchers(); 
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete voucher');
            }
        } catch (error) {
            console.error("Error deleting voucher:", error);
            toast.error('Failed to delete voucher');
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
                                    <CardTitle className="h4">Vouchers Table</CardTitle>
                                </Col>
                                <div style={{ display: 'flex' }} className="text-end">
                                    <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={props.onAddVoucherClick}>Add Voucher</Button>
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
                                                <Th>Voucher Code</Th>
                                                <Th>Secret ID</Th>
                                                <Th>Discount Type</Th>
                                                <Th>Discount Value</Th>
                                                <Th>Created By</Th>
                                                <Th>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {vouchers.map(voucher => (
                                                <Tr key={voucher.id}>
                                                    <Td>{voucher.voucher_code}</Td>
                                                    <Td>{voucher.voucher_secret_id}</Td>
                                                    <Td>{voucher.discount_type}</Td>
                                                    <Td>{voucher.voucher_discount} {voucher.discount_type === 'percentage' ? '%' : ''}</Td>
                                                    <Td>{voucher.creator?.name || 'N/A'}</Td>
                                                    <Td>
                                                        <Button 
                                                            color="danger" 
                                                            onClick={() => onDelete(voucher.id)}
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

export default connect(null, { setBreadcrumbItems })(VouchersTable);