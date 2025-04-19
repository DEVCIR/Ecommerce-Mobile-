import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button, CardTitle, Table } from "reactstrap";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const ExpenseCategoryTable = (props) => {
    document.title = "Expense Categories | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    
    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Expense Categories", link: "#" },
    ]

    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategoryData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/expense-categories`);
            const result = await response.json();
            
            if (result.data?.data && Array.isArray(result.data.data)) {
                setCategoryData(result.data.data);
                console.log("Expense categories loaded:", result.data.data);
            } else {
                setCategoryData([]);
                console.warn("Unexpected data format:", result);
            }
        } catch (error) {
            console.error("Error fetching expense category data:", error);
            setCategoryData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        props.setBreadcrumbItems('Expense Categories', breadcrumbItems);
        fetchCategoryData();
    }, []);

    const displayField = (value) => {
        return value ? value : 'N/A';
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/expense-categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success('Expense category deleted successfully');
                fetchCategoryData();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete expense category');
            }
        } catch (error) {
            console.error('Error deleting expense category:', error);
            toast.error('An error occurred while deleting the expense category');
        }
    };

    return (
        <React.Fragment>
            <Toaster position="top-right" richColors />
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Col>
                                    <CardTitle className="h4">Expense Categories</CardTitle>
                                </Col>
                                <Col style={{ display: 'flex', gap: '10px' }} className="text-end">
                                    <Button color="success" onClick={props.onAddExpenseCategoryClick}>
                                        Add Expense Category
                                    </Button>
                                </Col>
                            </div>
                            
                            {loading ? (
                                <div className="text-center">Loading expense categories...</div>
                            ) : (
                                <div className="table-responsive">
                                    <Table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Category Name</th>
                                                <th>Description</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categoryData.length > 0 ? (
                                                categoryData.map(category => (
                                                    <tr key={category.id}>
                                                        <td>{displayField(category.category_name)}</td>
                                                        <td>{displayField(category.description)}</td>
                                                        <td>
                                                            <Button 
                                                                color="primary" 
                                                                size="sm" 
                                                                onClick={() => props.onEditCategoryClick(category)}
                                                                className="me-2"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button 
                                                                color="danger" 
                                                                size="sm" 
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center">No expense category data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(ExpenseCategoryTable);