import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Dropdown, DropdownToggle, DropdownMenu, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import * as XLSX from "xlsx";

// const AdminStocklist = (props) => {
//     document.title = "Products Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";
//     const navigate = useNavigate()

//     const [products, setProducts] = useState([]);
//     const [showAddProduct, setShowAddProduct] = useState(false);

//     const breadcrumbItems = [
//         { title: "Lexa", link: "#" },
//         { title: "Tables", link: "#" },
//         { title: "Products Table", link: "#" },
//     ];

//     useEffect(() => {
//         props.setBreadcrumbItems('Products Table', breadcrumbItems);
//         console.log("addd prr")
//         fetchProducts();
//     }, [showAddProduct]);

//     const fetchProducts = async () => {
//         console.log("Data Updated")
//         try {
//             const response = await fetch("http://localhost:8000/api/inventory", {
//                 headers: {
//                     "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478"
//                 }
//             });
//             const data = await response.json();
//             setProducts(data.data.data);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }
//     };

//     const handleBackToTable = () => {
//         setShowAddProduct(false); // Go back to the table view
//     };



//     const handleDownloadExcel = () => {
//         if (!products || products.length === 0) {
//             console.error("No data available to download");
//             return;
//         }

//         try {
//             // Map only the specified fields
//             const excelData = products.filter(product => product.variant.product.is_active).map((item) => ({
//                 brand_name: item.variant?.product?.brand?.brand_name || "",
//                 model_name: item.variant?.product?.model_name || "",
//                 storage_gb: item.variant?.storage_gb || "",
//                 color: item.variant?.color || "",
//                 network_type: item?.variant?.network_type || "",
//                 sku: item?.variant?.product.sku || "",
//                 imei: item.imei || "",
//                 serial_no: item.serial_no || "",
//                 barcode: item.barcode || "",
//                 condition: item.condition || "",
//                 description: item?.variant?.product?.description || "",
//                 purchase_price: item.purchase_price || "",
//                 selling_price: item.discount_type === 'percentage' 
//                     ? (item.selling_price - (item.selling_price * (item.discount_price / 100))).toFixed(2) 
//                     : (item.selling_price - item.discount_price).toFixed(2) || "",
//                 difference: (((item.discount_type === 'percentage' 
//                     ? (item.selling_price - (item.selling_price * (item.discount_price / 100))) 
//                     : (item.selling_price - item.discount_price)) - item.purchase_price)).toFixed(2) || "",
//                 discount_type: item.discount_type || "",
//                 discount_price: item.discount_price || "",
//                 wholesale_price: item.wholesale_price || "",
//                 purchase_order_no: item.purchase_order_no || "",
//                 supplier: item.supplier.user.name || "",
//                 notes: item.notes || ""
//             }));

//             // Create a new workbook
//             const wb = XLSX.utils.book_new();
//             const ws = XLSX.utils.json_to_sheet(excelData);

//             // Add the worksheet to the workbook
//             XLSX.utils.book_append_sheet(wb, ws, "Stocklist Data");

//             // Generate the Excel file and trigger download
//             XLSX.writeFile(wb, "Stocklist_Data.xlsx");
//         } catch (error) {
//             console.error("Error generating Excel file:", error);
//         }
//     };

//     return (
//         <React.Fragment>
//             <Row>
//                 <Toaster position="top-right" richColors />
//                 <Col>
//                     <Card>
//                         <CardBody>
//                             {/* Conditionally render the heading and button */}
//                             {!showAddProduct ? (
//                                 <Row className="align-items-center mb-3">
//                                     <Col>
//                                         <CardTitle className="h4">Products Table</CardTitle>
//                                     </Col>
//                                     <Col className="text-end">
//                                         <Button color="info" style={{ marginRight: 2, padding: '10px 0' }} onClick={handleDownloadExcel}>Download Excel</Button>
//                                     </Col>
//                                 </Row>
//                             ) : (
//                                 <Row className="align-items-center mb-3">
//                                     <Col>
//                                         <CardTitle className="h4">Add Product</CardTitle>
//                                     </Col>
//                                     <Col className="text-end">
//                                         <Button color="secondary" onClick={handleBackToTable}>Back to Table</Button>
//                                     </Col>
//                                 </Row>
//                             )}

//                             {/* Conditionally render the AddProducts component or the table */}
//                             {showAddProduct ? (
//                                 <></>
//                             ) : (
//                                 <div className="table-rep-plugin">
//                                     <div className="table-responsive mb-0" data-pattern="priority-columns">
//                                         <Table id="tech-companies-1" className="table table-striped table-bordered">
//                                             <Thead>
//                                                 <Tr>
//                                                     <Th>Feature Image</Th>
//                                                     <Th>SKU</Th>
//                                                     <Th>Brand Name</Th>
//                                                     <Th>Model</Th>
//                                                     <Th>Condition</Th>
//                                                     <Th>Supplier ID</Th>
//                                                     <Th>Purchase Price</Th>
//                                                     <Th>Selling Price</Th>
//                                                     <Th>Discount Type</Th>
//                                                     <Th>Discount </Th>
//                                                     <Th>Difference</Th>
//                                                 </Tr>
//                                             </Thead>
//                                             <Tbody>
//                                                 {products.filter(product => product.variant.product.is_active).length > 0 ? (
//                                                     products.filter(product => product.variant.product.is_active).map((product) => (
//                                                         <Tr key={product.id}>
//                                                             <Td><img src={product.variant.product.feature_imageUrl} alt="Feature" width="50" /></Td>
//                                                             <Td>{product.variant.product.sku}</Td>
//                                                             <Td>{product.variant.product.brand.brand_name}</Td>
//                                                             <Td>{product.variant.product.model_name}</Td>
//                                                             <Td>{product.condition}</Td>
//                                                             <Td>{product.supplier.user.name}</Td>
//                                                             <Td>{product.purchase_price}</Td>
//                                                             <Td>
//                                                                 {product.discount_type === 'percentage' 
//                                                                     ? (product.selling_price - (product.selling_price * (product.discount_price / 100))).toFixed(2) 
//                                                                     : (product.selling_price - product.discount_price).toFixed(2)}
//                                                             </Td>
//                                                             <Td>{product.discount_type}</Td>
//                                                             <Td>{product.discount_price}</Td>
//                                                             <Td style={{ color: ((product.discount_type === 'percentage' 
//                                                                 ? (product.selling_price - (product.selling_price * (product.discount_price / 100))) 
//                                                                 : (product.selling_price - product.discount_price)) - product.purchase_price) > 0 ? 'green' : 'red' }}>
//                                                                 {((product.discount_type === 'percentage' 
//                                                                     ? (product.selling_price - (product.selling_price * (product.discount_price / 100))) 
//                                                                     : (product.selling_price - product.discount_price)) - product.purchase_price) > 0 ? (
//                                                                     <span>
//                                                                         <img src={upArr} alt="Increase" style={{ width: '12px', marginRight: '5px' }} />
//                                                                         {(((product.discount_type === 'percentage' 
//                                                                             ? (product.selling_price - (product.selling_price * (product.discount_price / 100))) 
//                                                                             : (product.selling_price - product.discount_price)) - product.purchase_price)).toFixed(2)}
//                                                                     </span>
//                                                                 ) : (
//                                                                     <span>
//                                                                         <img src={downArr} alt="Decrease" style={{ width: '12px', marginRight: '5px' }} />
//                                                                         {(((product.discount_type === 'percentage' 
//                                                                             ? (product.selling_price - (product.selling_price * (product.discount_price / 100))) 
//                                                                             : (product.selling_price - product.discount_price)) - product.purchase_price)).toFixed(2)}
//                                                                     </span>
//                                                                 )}
//                                                             </Td>
//                                                         </Tr>
//                                                     ))
//                                                 ) : (
//                                                     <Tr>
//                                                         <Td colSpan="10">No products available.</Td>
//                                                     </Tr>
//                                                 )}
//                                             </Tbody>
//                                         </Table>
//                                     </div>
//                                 </div>
//                             )}
//                         </CardBody>
//                     </Card>
//                 </Col>
//             </Row>
//         </React.Fragment>
//     );
// };

// export default connect(null, { setBreadcrumbItems })(AdminStocklist);


const AdminStocklist = (props) => {
  document.title = "Products Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  const navigate = useNavigate()

  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [incrementModal, setIncrementModal] = useState(false);
  const [incrementValue, setIncrementValue] = useState(0);

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

  // Add these state variables near your other state declarations
  const [purchasePriceFilterType, setPurchasePriceFilterType] = useState("min");
  const [sellingPriceFilterType, setSellingPriceFilterType] = useState("min");
  const [discountPriceFilterType, setDiscountPriceFilterType] = useState("min");
  const [wholesalePriceFilterType, setWholesalePriceFilterType] = useState("min");

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

      // Price filters with min/max
      if (filters.purchasePrice) {
        params.append('purchase_price', filters.purchasePrice);
        params.append('purchase_price_type', filters.purchasePriceType || "min");
      }
      if (filters.sellingPrice) {
        params.append('selling_price', filters.sellingPrice);
        params.append('selling_price_type', filters.sellingPriceType || "min");
      }
      if (filters.discountPrice) {
        params.append('discount_price', filters.discountPrice);
        params.append('discount_price_type', filters.discountPriceType || "min");
      }
      if (filters.wholesalePrice) {
        params.append('wholesale_price', filters.wholesalePrice);
        params.append('wholesale_price_type', filters.wholesalePriceType || "min");
      }

      // Additional filters
      if (filters.serialNo) params.append('serial_no', filters.serialNo);
      if (filters.discountType) params.append('discount_type', filters.discountType);
      if (filters.purchaseOrderNo) params.append('purchase_order_no', filters.purchaseOrderNo);
      if (filters.stockStatus) params.append('stock_status', filters.stockStatus);
      if (filters.color) params.append('color', filters.color);
      if (filters.category) params.append('category', filters.category);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
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
      purchasePriceType: purchasePriceFilterType,
      sellingPrice: sellingPriceFilter,
      sellingPriceType: sellingPriceFilterType,
      discountPrice: discountPriceFilter,
      discountPriceType: discountPriceFilterType,
      wholesalePrice: wholesalePriceFilter,
      wholesalePriceType: wholesalePriceFilterType,
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
    setPurchasePriceFilterType("min");
    setSellingPriceFilterType("min");
    setDiscountPriceFilterType("min");
    setWholesalePriceFilterType("min");
    setSerialNoFilter("");
    setDiscountTypeFilter("");
    setPurchaseOrderNoFilter("");
    setStockStatusFilter("");
    setColorFilter("");
    setCategoryFilter("");
    fetchProducts();
    setIsFilterApplied(false);
  };

  const handleBackToTable = () => {
    setShowAddProduct(false); // Go back to the table view
  };

  const handleDownloadWithIncrement = () => {
    setIncrementModal(true);
  };

  const handleDownloadExcel = () => {
    if (!products || products.length === 0) {
      console.error("No data available to download");
      return;
    }

    try {
      // Map only the specified fields
      const excelData = products.filter(product => product.variant.product.is_active).map((item) => ({
        brand_name: item.variant?.product?.brand?.brand_name || "",
        model_name: item.variant?.product?.model_name || "",
        storage_gb: item.variant?.storage_gb || "",
        color: item.variant?.color || "",
        network_type: item?.variant?.network_type || "",
        sku: item?.variant?.product.sku || "",
        imei: item.imei || "",
        serial_no: item.serial_no || "",
        barcode: item.barcode || "",
        condition: item.condition || "",
        description: item?.variant?.product?.description || "",
        purchase_price: item.purchase_price || "",
        selling_price: item.discount_type === 'percentage'
          ? (item.selling_price - (item.selling_price * (item.discount_price / 100))).toFixed(2)
          : (item.selling_price - item.discount_price).toFixed(2) || "",
        difference: (((item.discount_type === 'percentage'
          ? (item.selling_price - (item.selling_price * (item.discount_price / 100)))
          : (item.selling_price - item.discount_price)) - item.purchase_price)).toFixed(2) || "",
        discount_type: item.discount_type || "",
        discount_price: item.discount_price || "",
        wholesale_price: item.wholesale_price || "",
        purchase_order_no: item.purchase_order_no || "",
        supplier: item.supplier.user.name || "",
        notes: item.notes || ""
      }));

      // Create a new workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Stocklist Data");

      // Generate the Excel file and trigger download
      XLSX.writeFile(wb, "Stocklist_Data.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  const confirmDownloadWithIncrement = () => {
    if (!products || products.length === 0) {
      console.error("No data available to download");
      return;
    }

    try {
      const increment = parseFloat(incrementValue) || 0;

      // Map the fields and add increment to specified fields
      const excelData = products.filter(product => product.variant.product.is_active).map((item) => ({
        brand_name: item.variant?.product?.brand?.brand_name || "",
        model_name: item.variant?.product?.model_name || "",
        storage_gb: item.variant?.storage_gb || "",
        color: item.variant?.color || "",
        network_type: item?.variant?.network_type || "",
        sku: item?.variant?.product.sku || "",
        variant_id: item.variant?.id || "",
        imei: item.imei || "",
        serial_no: item.serial_no || "",
        barcode: item.barcode || "",
        condition: item.condition || "",
        description: item?.variant?.product?.description || "",
        purchase_price: (parseFloat(item.purchase_price) || 0) + (parseFloat(item.purchase_price) * parseFloat(increment / 100)),
        selling_price: item.discount_type === 'percentage'
          ? ((item.selling_price - (item.selling_price * (item.discount_price / 100))) + (parseFloat((item.selling_price - (item.selling_price * (item.discount_price / 100)))) * parseFloat(increment / 100))).toFixed(2)
          : (item.selling_price - item.discount_price + (parseFloat(item.selling_price - item.discount_price) * parseFloat(increment / 100))).toFixed(2),
        discount_type: item.discount_type || "",
        discount_price: (parseFloat(item.discount_price) || 0) + (parseFloat(item.discount_price) * parseFloat(increment / 100)),
        wholesale_price: (parseFloat(item.wholesale_price) || 0) + (parseFloat(item.wholesale_price) * parseFloat(increment / 100)),
        purchase_order_no: item.purchase_order_no || "",
        supplier_id: item.supplier_id || "",
        stock_status: item.stock_status || "",
        notes: item.notes || "",
        is_active: item.is_active ? "Yes" : "No",
      }));

      // Create a new workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Data");

      // Generate the Excel file and trigger download
      XLSX.writeFile(wb, `Inventory_Data_with_Increment_${increment}.xlsx`);

      // Close the modal
      setIncrementModal(false);
      setIncrementValue(0);
    } catch (error) {
      console.error("Error generating Excel file with increment:", error);
    }
  };

  return (
    <React.Fragment>
      <Row style={{ minHeight: '60vh' }}>
        <Toaster position="top-right" richColors />
        <Col>
          <Card>
            <CardBody>
              {!showAddProduct ? (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Products Table</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="info" style={{ marginRight: 2, padding: '10px 0' }} onClick={handleDownloadExcel}>Download Excel</Button>
                  </Col>
                  <Col className="text-end">
                    <Button color="info" style={{ marginRight: 2, padding: '10px 0' }} onClick={handleDownloadWithIncrement}>Download Excel With Increment</Button>
                  </Col>
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

              {/* Filter Dropdown */}
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

                      <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                        <div className="col-md-6">
                          <Label>Purchase Price</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Input
                              type="number"
                              value={purchasePriceFilter}
                              onChange={(e) => setPurchasePriceFilter(e.target.value)}
                              placeholder="Amount"
                              style={{ flex: 1 }}
                            />
                            <select
                              value={purchasePriceFilterType}
                              onChange={(e) => setPurchasePriceFilterType(e.target.value)}
                              style={{ width: '80px' }}
                            >
                              <option value="min">Min(≥)</option>
                              <option value="max">Max(≤)</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <Label>Selling Price</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Input
                              type="number"
                              value={sellingPriceFilter}
                              onChange={(e) => setSellingPriceFilter(e.target.value)}
                              placeholder="Amount"
                              style={{ flex: 1 }}
                            />
                            <select
                              value={sellingPriceFilterType}
                              onChange={(e) => setSellingPriceFilterType(e.target.value)}
                              style={{ width: '80px' }}
                            >
                              <option value="min">Min(≥)</option>
                              <option value="max">Max(≤)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row" style={{ margin: 0, marginTop: '10px' }}>
                        <div className="col-md-6">
                          <Label>Discount Price</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Input
                              type="number"
                              value={discountPriceFilter}
                              onChange={(e) => setDiscountPriceFilter(e.target.value)}
                              placeholder="Amount"
                              style={{ flex: 1 }}
                            />
                            <select
                              value={discountPriceFilterType}
                              onChange={(e) => setDiscountPriceFilterType(e.target.value)}
                              style={{ width: '80px' }}
                            >
                              <option value="min">Min(≥)</option>
                              <option value="max">Max(≤)</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <Label>Wholesale Price</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Input
                              type="number"
                              value={wholesalePriceFilter}
                              onChange={(e) => setWholesalePriceFilter(e.target.value)}
                              placeholder="Amount"
                              style={{ flex: 1 }}
                            />
                            <select
                              value={wholesalePriceFilterType}
                              onChange={(e) => setWholesalePriceFilterType(e.target.value)}
                              style={{ width: '80px' }}
                            >
                              <option value="min">Min(≥)</option>
                              <option value="max">Max(≤)</option>
                            </select>
                          </div>
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

              {showAddProduct ? (
                <></>
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
                          <Th>Selling Price After Discount</Th>
                          <Th>Difference</Th>
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
                              <Td>{product.purchase_price}</Td>
                              <Td>{product.selling_price}</Td>
                              <Td>{product.discount_type}</Td>
                              <Td>{product.discount_price}</Td>
                              <Td>
                                {product.discount_type === 'percentage'
                                  ? (product.selling_price - (product.selling_price * (product.discount_price / 100))).toFixed(2)
                                  : (product.selling_price - product.discount_price).toFixed(2)}
                              </Td>
                              <Td style={{
                                color: ((product.discount_type === 'percentage'
                                  ? (product.selling_price - (product.selling_price * (product.discount_price / 100)))
                                  : (product.selling_price - product.discount_price)) - product.purchase_price) > 0 ? 'green' : 'red'
                              }}>
                                {((product.discount_type === 'percentage'
                                  ? (product.selling_price - (product.selling_price * (product.discount_price / 100)))
                                  : (product.selling_price - product.discount_price)) - product.purchase_price).toFixed(2)}
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan="11">No products available.</Td>
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
      <Modal isOpen={incrementModal} toggle={() => setIncrementModal(!incrementModal)}>
        <ModalHeader toggle={() => setIncrementModal(!incrementModal)}>Enter Increment Value</ModalHeader>
        <ModalBody>
          <Label for="incrementValue">Enter the value to increment prices:</Label>
          <Input
            type="number"
            id="incrementValue"
            value={incrementValue}
            onChange={(e) => setIncrementValue(e.target.value)}
            placeholder="Enter increment value"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmDownloadWithIncrement}>
            Download with Increment
          </Button>{' '}
          <Button color="secondary" onClick={() => setIncrementModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(AdminStocklist);