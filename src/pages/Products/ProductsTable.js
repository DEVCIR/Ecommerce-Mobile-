import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Dropdown, DropdownToggle, DropdownMenu, Input, Label } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import AddProducts from "./AddProducts";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";


const ProductsTable = (props) => {
  document.title = "Products Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  const navigate = useNavigate()

  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [modelNameFilter, setModelNameFilter] = useState("");
  const [brandNameFilter, setBrandNameFilter] = useState("");
  const [skuFilter, setSkuFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");

  const [purchasePriceFilter, setPurchasePriceFilter] = useState("");
  const [sellingPriceFilter, setSellingPriceFilter] = useState("");
  const [discountPriceFilter, setDiscountPriceFilter] = useState("");
  const [wholesalePriceFilter, setWholesalePriceFilter] = useState("");

  const [serialNoFilter, setSerialNoFilter] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("");
  const [purchaseOrderNoFilter, setPurchaseOrderNoFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Tables", link: "#" },
    { title: "Products Table", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems('Products Table', breadcrumbItems);
    fetchProducts();
  }, [showAddProduct]);

  const fetchProducts = async (filters = {}) => {
    try {
      let url = "http://localhost:8000/api/inventory";
      const params = new URLSearchParams();

      // Main filters
      if (filters.modelName) params.append('model_name', filters.modelName);
      if (filters.brandName) params.append('brand_name', filters.brandName);
      if (filters.sku) params.append('sku', filters.sku);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.purchasePrice) params.append('purchase_price', filters.purchasePrice);
      if (filters.sellingPrice) params.append('selling_price', filters.sellingPrice);
      if (filters.discountPrice) params.append('discount_price', filters.discountPrice);
      if (filters.wholesalePrice) params.append('wholesale_price', filters.wholesalePrice);

      // Additional filters
      if (filters.serialNo) params.append('serial_no', filters.serialNo);
      if (filters.discountType) params.append('discount_type', filters.discountType);
      if (filters.purchaseOrderNo) params.append('purchase_order_no', filters.purchaseOrderNo);
      if (filters.stockStatus) params.append('stock_status', filters.stockStatus);
      if (filters.color) params.append('color', filters.color);
      if (filters.category) params.append('category', filters.category);

      if (params.toString()) {
        url += `? ${params.toString()}`;
      }

      const response = await fetch(url, {
      });
      const data = await response.json();
      setProducts(data.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const applyFilter = () => {
    fetchProducts({
      modelName: modelNameFilter,
      brandName: brandNameFilter,
      sku: skuFilter,
      condition: conditionFilter,
      purchasePrice: purchasePriceFilter,
      sellingPrice: sellingPriceFilter,
      discountPrice: discountPriceFilter,
      wholesalePrice: wholesalePriceFilter,
      serialNo: serialNoFilter,
      discountType: discountTypeFilter,
      purchaseOrderNo: purchaseOrderNoFilter,
      stockStatus: stockStatusFilter,
      color: colorFilter,
      category: categoryFilter
    });
    setIsFilterApplied(true);
    setFilterDropdownOpen(false);
  };


  const clearFilter = () => {
    setModelNameFilter("");
    setBrandNameFilter("");
    setSkuFilter("");
    setConditionFilter("");
    setPurchasePriceFilter("");
    setSellingPriceFilter("");
    setDiscountPriceFilter("");
    setWholesalePriceFilter("");
    setSerialNoFilter("");
    setDiscountTypeFilter("");
    setPurchaseOrderNoFilter("");
    setStockStatusFilter("");
    setColorFilter("");
    setCategoryFilter("");
    fetchProducts();
    setIsFilterApplied(false);
  };

  // Handle edit action
  const handleEdit = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  // Handle delete action
  const handleDelete = async (productId) => {
    // Confirm deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      // const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
      //   method: "DELETE",
      //   headers: {
      //     Authorization: "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
      //   },
      // });
      const response = await fetch(`http://127.0.0.1:8000/api/inventory/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: false })
      });

      if (response.ok) {
        toast.success(`Product Deleted Successfully`)
        fetchProducts();
      } else {
        toast(`Error Deleting Product`)
      }
    } catch (error) {
      toast.error(`Error Deleting Product`)
    }
  };

  const handleAddProduct = () => {
    setShowAddProduct(true); // Show the AddProducts component
  };

  const handleBackToTable = () => {
    setShowAddProduct(false); // Go back to the table view
  };

  return (
    <React.Fragment>
      <Row style={{ minHeight: '60vh' }}>
        <Toaster position="top-right" richColors />
        <Col>
          <Card>
            <CardBody>
              {/* Conditionally render the heading and button */}
              {!showAddProduct ? (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Products Table</CardTitle>
                  </Col>
                  {/* <Col className="text-end">
                    <Button color="secondary" style={{ marginRight:2 }} onClick={() => { navigate('/inventory-upload') }}>Upload Products File</Button>
                    <Button color="success" onClick={handleAddProduct}>Add Product</Button>
                  </Col> */}
                </Row>
              ) : (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Add Product</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="secondary" onClick={handleBackToTable}>Back to Table</Button>
                  </Col>
                </Row>
              )}
              <Row className="mb-3">
                <Col>
                  <Dropdown
                    isOpen={filterDropdownOpen}
                    toggle={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  >
                    <DropdownToggle color="light" caret>
                      Filter
                    </DropdownToggle>
                    <DropdownMenu style={{
                      width: '500px',
                      height: '40vh',
                      overflowY: 'scroll',
                      padding: '10px'
                    }}>
                      {/* First Row - Model, Brand */}
                      <div className="row" style={{ margin: 0 }}>
                        <div className="col-md-6">
                          <Label>Model Name</Label>
                          <Input
                            type="text"
                            value={modelNameFilter}
                            onChange={(e) => setModelNameFilter(e.target.value)}
                            placeholder="Enter model"
                          />
                        </div>
                        <div className="col-md-6">
                          <Label>Brand Name</Label>
                          <Input
                            type="text"
                            value={brandNameFilter}
                            onChange={(e) => setBrandNameFilter(e.target.value)}
                            placeholder="Enter brand"
                          />
                        </div>
                      </div>

                      {/* Second Row - SKU, Condition */}
                      <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                        <div className="col-md-6">
                          <Label>SKU</Label>
                          <Input
                            type="text"
                            value={skuFilter}
                            onChange={(e) => setSkuFilter(e.target.value)}
                            placeholder="Enter SKU"
                          />
                        </div>
                        <div className="col-md-6">
                          <Label>Condition</Label>
                          <Input
                            type="text"
                            value={conditionFilter}
                            onChange={(e) => setConditionFilter(e.target.value)}
                            placeholder="Enter condition"
                          />
                        </div>
                      </div>

                      {/* Third Row - Purchase, Selling Price */}
                      <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                        <div className="col-md-6">
                          <Label>Purchase Price</Label>
                          <Input
                            type="number"
                            value={purchasePriceFilter}
                            onChange={(e) => setPurchasePriceFilter(e.target.value)}
                            placeholder="Purchase price"
                          />
                        </div>
                        <div className="col-md-6">
                          <Label>Selling Price</Label>
                          <Input
                            type="number"
                            value={sellingPriceFilter}
                            onChange={(e) => setSellingPriceFilter(e.target.value)}
                            placeholder="Selling price"
                          />
                        </div>
                      </div>

                      {/* Fourth Row - Discount, Wholesale Price */}
                      <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                        <div className="col-md-6">
                          <Label>Discount Price</Label>
                          <Input
                            type="number"
                            value={discountPriceFilter}
                            onChange={(e) => setDiscountPriceFilter(e.target.value)}
                            placeholder="Discount price"
                          />
                        </div>
                        <div className="col-md-6">
                          <Label>Wholesale Price</Label>
                          <Input
                            type="number"
                            value={wholesalePriceFilter}
                            onChange={(e) => setWholesalePriceFilter(e.target.value)}
                            placeholder="Wholesale price"
                          />
                        </div>
                      </div>

                      {/* More Filters Button */}
                      <div className="text-center mt-2">
                        <Button
                          color="link"
                          size="sm"
                          onClick={() => setShowMoreFilters(!showMoreFilters)}
                        >
                          {showMoreFilters ? (
                            <span><i className="mdi mdi-minus"></i> Fewer Filters</span>
                          ) : (
                            <span><i className="mdi mdi-plus"></i> More Filters</span>
                          )}
                        </Button>
                      </div>

                      {/* Additional Filters (shown when More Filters is clicked) */}
                      {showMoreFilters && (
                        <>
                          <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                            <div className="col-md-6">
                              <Label>Serial No</Label>
                              <Input
                                type="text"
                                value={serialNoFilter}
                                onChange={(e) => setSerialNoFilter(e.target.value)}
                                placeholder="Enter serial no"
                              />
                            </div>
                            <div className="col-md-6">
                              <Label>Discount Type</Label>
                              <Input
                                type="text"
                                value={discountTypeFilter}
                                onChange={(e) => setDiscountTypeFilter(e.target.value)}
                                placeholder="Enter discount type"
                              />
                            </div>
                          </div>
                          <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                            <div className="col-md-6">
                              <Label>Purchase Order No</Label>
                              <Input
                                type="text"
                                value={purchaseOrderNoFilter}
                                onChange={(e) => setPurchaseOrderNoFilter(e.target.value)}
                                placeholder="Enter PO number"
                              />
                            </div>
                            <div className="col-md-6">
                              <Label>Stock Status</Label>
                              <Input
                                type="text"
                                value={stockStatusFilter}
                                onChange={(e) => setStockStatusFilter(e.target.value)}
                                placeholder="Enter stock status"
                              />
                            </div>
                          </div>
                          <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                            <div className="col-md-6">
                              <Label>Color</Label>
                              <Input
                                type="text"
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                                placeholder="Enter color"
                              />
                            </div>
                            <div className="col-md-6">
                              <Label>Category</Label>
                              <Input
                                type="text"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                placeholder="Enter category"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="d-flex justify-content-between mt-3">
                        <Button color="primary" size="sm" onClick={applyFilter}>
                          Apply Filter
                        </Button>
                        {isFilterApplied && (
                          <Button color="danger" size="sm" onClick={clearFilter}>
                            Clear All
                          </Button>
                        )}
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
              </Row>
              {/* Conditionally render the AddProducts component or the table */}
              {showAddProduct ? (
                <AddProducts setShowAddProduct={setShowAddProduct} />
              ) : (
                <div className="table-rep-plugin">
                  <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="tech-companies-1" className="table table-striped table-bordered">
                      <Thead>
                        <Tr>
                          <Th>Feature Image</Th>
                          <Th>SKU</Th>
                          <Th>Brand Name</Th>
                          <Th>Model</Th>
                          <Th>Condition</Th>
                          <Th>Supplier ID</Th>
                          <Th>Purchase Price</Th>
                          <Th>Selling Price</Th>
                          <Th>Discount Type</Th>
                          <Th>Discount</Th>
                          <Th>Discounted Price</Th>
                          <Th>Action</Th>
                          {/* <Th>Order</Th> */}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {products.filter(product => product.variant.product.is_active).length > 0 ? (
                          products.filter(product => product.variant.product.is_active).map((product) => (
                            <Tr key={product.id}>
                              <Td><img src={product.variant.product.feature_imageUrl} alt="Feature" width="50" /></Td>
                              <Td>{product.variant.product.sku}</Td>
                              <Td>{product.variant.product.brand.brand_name}</Td>
                              <Td>{product.variant.product.model_name}</Td>
                              <Td>{product.condition}</Td>
                              <Td>{product.supplier.user.name}</Td>
                              {/* <Td>{product.Status}</Td> */}
                              <Td>{product.purchase_price}</Td>
                              <Td>{product.selling_price}</Td>
                              <Td>{product.discount_type}</Td>
                              <Td>{product.discount_price}</Td>
                              <Td> {product.discount_type === 'percentage'
                                ? (product.selling_price - (product.selling_price * (product.discount_price / 100))).toFixed(2)
                                : (product.selling_price - product.discount_price).toFixed(2)}
                              </Td>
                              <Td style={{ display: 'flex' }}>
                                <Button color="primary" onClick={() => handleEdit(product.id)}>Edit</Button>
                                <Button color="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                              </Td>
                              {/* <Td>
                                <Button color="secondary" onClick={() => { navigate(`/orders/${product.variant.product.id}`) }}>Order Now</Button>
                              </Td> */}
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan="10">No products available.</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(ProductsTable);
