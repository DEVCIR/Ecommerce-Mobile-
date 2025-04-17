import React, { useEffect, useState } from "react"

import { Row, Col, Card, CardBody, Button, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

import { connect } from "react-redux";

import { setBreadcrumbItems } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const InventoryTable = (props) => {
    const navigate = useNavigate()
    document.title = "Responsive Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";
    const [incrementModal, setIncrementModal] = useState(false);
    const [incrementValue, setIncrementValue] = useState(0);

    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [modelFilter, setModelFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [serialNoFilter, setSerialNoFilter] = useState("");
    const [conditionFilter, setConditionFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
    const [imeiFilter, setImeiFilter] = useState("");
    const [purchasePriceFilter, setPurchasePriceFilter] = useState("");
    const [sellingPriceFilter, setSellingPriceFilter] = useState("");
    const [discountPriceFilter, setDiscountPriceFilter] = useState("");
    const [wholesalePriceFilter, setWholesalePriceFilter] = useState("");
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [discountTypeFilter, setDiscountTypeFilter] = useState("");
    const [purchaseOrderNoFilter, setPurchaseOrderNoFilter] = useState("");
    const [stockStatusFilter, setStockStatusFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [networkTypeFilter, setNetworkTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const toggleFilterDropdown = () => setFilterDropdownOpen(prevState => !prevState);

    const handleDownloadWithIncrement = () => {
        setIncrementModal(true);
    };

    const fetchInventoryData = async (
        modelFilter = "",
        brandFilter = "",
        supplierFilter = "",
        serialNoFilter = "",
        imeiFilter = "",
        conditionFilter = "",
        purchasePriceFilter = "",
        sellingPriceFilter = "",
        discountPriceFilter = "",
        wholesalePriceFilter = "",
        discountTypeFilter = "",
        purchaseOrderNoFilter = "",
        stockStatusFilter = "",
        colorFilter = "",
        networkTypeFilter = "",
        categoryFilter = ""
    ) => {
        try {
            let url = "http://127.0.0.1:8000/api/inventory";
            const params = new URLSearchParams();

            // Existing filters
            if (modelFilter) params.append('model_name', modelFilter);
            if (brandFilter) params.append('brand_name', brandFilter);
            if (supplierFilter) params.append('supplier', supplierFilter);
            if (serialNoFilter) params.append('serial_no', serialNoFilter);
            if (imeiFilter) params.append('imei', imeiFilter);
            if (conditionFilter) params.append('condition', conditionFilter);
            if (purchasePriceFilter) params.append('purchase_price', purchasePriceFilter);
            if (sellingPriceFilter) params.append('selling_price', sellingPriceFilter);
            if (discountPriceFilter) params.append('discount_price', discountPriceFilter);
            if (wholesalePriceFilter) params.append('wholesale_price', wholesalePriceFilter);

            // New filters
            if (discountTypeFilter) params.append('discount_type', discountTypeFilter);
            if (purchaseOrderNoFilter) params.append('purchase_order_no', purchaseOrderNoFilter);
            if (stockStatusFilter) params.append('stock_status', stockStatusFilter);
            if (colorFilter) params.append('color', colorFilter);
            if (networkTypeFilter) params.append('network_type', networkTypeFilter);
            if (categoryFilter) params.append('category', categoryFilter);

            if (params.toString()) {
                url += `? ${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setInventoryData(data.data.data);
        } catch (error) {
            console.error("Error fetching inventory data:", error);
        }
    };

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]

    const [inventoryData, setInventoryData] = useState([]);

    useEffect(() => {
        props.setBreadcrumbItems('Responsive Table', breadcrumbItems);
        fetchInventoryData();
    }, [props]);

    const applyFilter = () => {
        fetchInventoryData(
            modelFilter,
            brandFilter,
            supplierFilter,
            serialNoFilter,
            imeiFilter,
            conditionFilter,
            purchasePriceFilter,
            sellingPriceFilter,
            discountPriceFilter,
            wholesalePriceFilter,
            discountTypeFilter,
            purchaseOrderNoFilter,
            stockStatusFilter,
            colorFilter,
            networkTypeFilter,
            categoryFilter
        );
        setIsFilterApplied(true);
        setFilterDropdownOpen(false);
    };

    const clearFilter = () => {
        setModelFilter("");
        setBrandFilter("");
        setSupplierFilter("");
        setSerialNoFilter("");
        setImeiFilter("");
        setConditionFilter("");
        setPurchasePriceFilter("");
        setSellingPriceFilter("");
        setDiscountPriceFilter("");
        setWholesalePriceFilter("");
        setDiscountTypeFilter("");
        setPurchaseOrderNoFilter("");
        setStockStatusFilter("");
        setColorFilter("");
        setNetworkTypeFilter("");
        setCategoryFilter("");
        fetchInventoryData();
        setIsFilterApplied(false);
    };


    // Function to handle delete action
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inventory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478'
                }
            });

            if (response.ok) {
                console.log("Deleted item with ID:", id);
                // Optionally, update the local state to remove the deleted item
                setInventoryData(prevData => prevData.filter(item => item.inventoryID !== id));
            } else {
                console.error("Failed to delete item with ID:", id);
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    // Function to handle status change
    const handleStatusChange = async (id, status) => {
        const active = status === "Add"; // Save true if status is "Add", else false
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inventory/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: active })
            });

            if (response.ok) {
                console.log("Updated status for item with ID:", id);
                // Update the local state to reflect the new status
                setInventoryData(prevData =>
                    prevData.map(item =>
                        item.id === id ? { ...item, variant: { ...item.variant, product: { ...item.variant.product, is_active: active } } } : item
                    )
                );
            } else {
                console.error("Failed to update status for item with ID:", id);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const handleDownloadExcel = () => {
        if (!inventoryData || inventoryData.length === 0) {
            console.error("No data available to download");
            return;
        }

        try {
            // Map only the specified fields
            const excelData = inventoryData.map((item) => ({
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
                purchase_price: item.purchase_price || "",
                selling_price: item.discount_type === 'percentage'
                    ? (item.selling_price - (item.selling_price * (item.discount_price / 100))).toFixed(2)
                    : (item.selling_price - item.discount_price).toFixed(2) || "",
                discount_type: item.discount_type || "",
                discount_price: item.discount_price || "",
                wholesale_price: item.wholesale_price || "",
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
            XLSX.writeFile(wb, "Inventory_Data.xlsx");
        } catch (error) {
            console.error("Error generating Excel file:", error);
        }
    };


    const confirmDownloadWithIncrement = () => {
        if (!inventoryData || inventoryData.length === 0) {
            console.error("No data available to download");
            return;
        }

        try {
            const increment = parseFloat(incrementValue) || 0;

            // Map the fields and add increment to specified fields
            const excelData = inventoryData.map((item) => ({
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
            <Row style={{ minHeight: '70vh' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px' }}>
                                {/* <CardTitle className="h4">Inventory Data</CardTitle>
                                <Button color="success" onClick={props.onAddProductClick}>Add Inventory</Button> */}
                                <Col>
                                    <CardTitle className="h4">Inventory Table</CardTitle>
                                </Col>
                                <Col style={{ display: 'flex' }} className="text-end">
                                    <Button color="primary" style={{ marginLeft: 2, marginRight: 2, padding: '10px 0' }} onClick={handleDownloadWithIncrement}>Download with Increment</Button>
                                    <Button color="info" style={{ marginRight: 2, padding: '10px 0' }} onClick={handleDownloadExcel}>Download Excel</Button>
                                    <Button color="secondary" style={{ marginRight: 2, padding: '10px 0' }} onClick={() => { navigate('/live-inventory') }}>Upload Products By Name</Button>
                                    <Button color="secondary" style={{ marginRight: 2, padding: '10px 0' }} onClick={() => { navigate('/inventory-upload') }}>Upload Products File</Button>
                                    <Button color="success" style={{ marginLeft: 2, padding: '10px 0' }} onClick={props.onAddProductClick}>Add Inventory</Button>
                                </Col>
                            </div>
                            <Row className="mb-3">
                                <Col>
                                    <Dropdown isOpen={filterDropdownOpen} toggle={toggleFilterDropdown}>
                                        <DropdownToggle color="light" caret>
                                            Filter
                                        </DropdownToggle>

                                        <DropdownMenu style={{
                                            width: '40%',
                                            height: '40vh',
                                            overflowY: 'scroll',
                                            padding: '10px'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {/* First Row - Model, Brand, Supplier */}
                                                <div className="row" style={{ margin: 0 }}>
                                                    <div className="col-md-4">
                                                        <Label>Model Name</Label>
                                                        <Input
                                                            type="text"
                                                            value={modelFilter}
                                                            onChange={(e) => setModelFilter(e.target.value)}
                                                            placeholder="Enter model"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <Label>Brand Name</Label>
                                                        <Input
                                                            type="text"
                                                            value={brandFilter}
                                                            onChange={(e) => setBrandFilter(e.target.value)}
                                                            placeholder="Enter brand"
                                                        />
                                                    </div>
                                                    {/* <div className="col-md-4">
        <Label>Supplier</Label>
        <Input
          type="text"
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
          placeholder="Enter supplier"
        />
      </div> */}
                                                </div>

                                                {/* Second Row - Serial, IMEI, Condition */}
                                                <div className="row" style={{ margin: 0 }}>
                                                    <div className="col-md-4">
                                                        <Label>Serial No</Label>
                                                        <Input
                                                            type="text"
                                                            value={serialNoFilter}
                                                            onChange={(e) => setSerialNoFilter(e.target.value)}
                                                            placeholder="Enter serial"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <Label>IMEI</Label>
                                                        <Input
                                                            type="text"
                                                            value={imeiFilter}
                                                            onChange={(e) => setImeiFilter(e.target.value)}
                                                            placeholder="Enter IMEI"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <Label>Condition</Label>
                                                        <Input
                                                            type="text"
                                                            value={conditionFilter}
                                                            onChange={(e) => setConditionFilter(e.target.value)}
                                                            placeholder="Enter condition"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Third Row - Price Filters */}
                                                <div className="row" style={{ margin: 0 }}>
                                                    <div className="col-md-3">
                                                        <Label>Purchase Price</Label>
                                                        <Input
                                                            type="number"
                                                            value={purchasePriceFilter}
                                                            onChange={(e) => setPurchasePriceFilter(e.target.value)}
                                                            placeholder="$ Purchase"
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label>Selling Price</Label>
                                                        <Input
                                                            type="number"
                                                            value={sellingPriceFilter}
                                                            onChange={(e) => setSellingPriceFilter(e.target.value)}
                                                            placeholder="$ Selling"
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label>Discount Price</Label>
                                                        <Input
                                                            type="number"
                                                            value={discountPriceFilter}
                                                            onChange={(e) => setDiscountPriceFilter(e.target.value)}
                                                            placeholder="$ Discount"
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Label>Wholesale</Label>
                                                        <Input
                                                            type="number"
                                                            value={wholesalePriceFilter}
                                                            onChange={(e) => setWholesalePriceFilter(e.target.value)}
                                                            placeholder="$ Wholesale"
                                                        />
                                                    </div>
                                                </div>

                                                {/* More Filters Section (conditionally rendered) */}
                                                {showMoreFilters && (
                                                    <>
                                                        {/* Fourth Row - Additional Filters */}
                                                        <div className="row" style={{ margin: 0 }}>
                                                            <div className="col-md-3">
                                                                <Label>Discount Type</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={discountTypeFilter}
                                                                    onChange={(e) => setDiscountTypeFilter(e.target.value)}
                                                                    placeholder="Discount type"
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label>PON</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={purchaseOrderNoFilter}
                                                                    onChange={(e) => setPurchaseOrderNoFilter(e.target.value)}
                                                                    placeholder="PO number"
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label>Stock Status</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={stockStatusFilter}
                                                                    onChange={(e) => setStockStatusFilter(e.target.value)}
                                                                    placeholder="Stock status"
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label>Color</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={colorFilter}
                                                                    onChange={(e) => setColorFilter(e.target.value)}
                                                                    placeholder="Color"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Fifth Row - More Additional Filters */}
                                                        <div className="row" style={{ margin: 0 }}>
                                                            <div className="col-md-4">
                                                                <Label>Network Type</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={networkTypeFilter}
                                                                    onChange={(e) => setNetworkTypeFilter(e.target.value)}
                                                                    placeholder="Network type"
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <Label>Category</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={categoryFilter}
                                                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                                                    placeholder="Category"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* More Filters Button */}
                                                <div className="text-center">
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

                                                {/* Fixed Buttons at Bottom */}
                                                <div className="d-flex justify-content-between mt-2">
                                                    <Button color="primary" size="sm" onClick={applyFilter}>
                                                        Apply Filter
                                                    </Button>
                                                    {isFilterApplied && (
                                                        <Button color="danger" size="sm" onClick={clearFilter}>
                                                            Clear All
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </DropdownMenu>

                                    </Dropdown>
                                </Col>
                            </Row>
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
                                                <Th>Feature_ImageURL</Th>
                                                <Th>Model</Th>
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
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {Array.isArray(inventoryData) ? inventoryData.map(item => (
                                                <Tr key={item.id}>
                                                    <Td>
                                                        <img src={item.variant.product.feature_imageUrl} alt={item.variant.product.model_name} style={{ width: '50px', height: '50px' }} />
                                                    </Td>
                                                    <Td>{item.variant.product.model_name}</Td>
                                                    <Td>{item.variant.product.sku}</Td>
                                                    <Td>{item.variant.product.brand.brand_name}</Td>
                                                    <Td>{item.variant.product.model_name}</Td>
                                                    <Td>{item.condition}</Td>
                                                    <Td>{item.supplier.user.name}</Td>
                                                    <Td>{item.purchase_price}</Td>
                                                    <Td>{item.selling_price}</Td>
                                                    <Td>{item.discount_type}</Td>
                                                    <Td>{item.discount_price}</Td>
                                                    <Td> {item.discount_type === 'percentage'
                                                        ? (item.selling_price - (item.selling_price * (item.discount_price / 100))).toFixed(2)
                                                        : (item.selling_price - item.discount_price).toFixed(2)}
                                                    </Td>
                                                    <Td>
                                                        <Button
                                                            color={item.variant.product.is_active ? "success" : "secondary"}
                                                            onClick={() => handleStatusChange(item.id, "Add")}
                                                        >
                                                            Available
                                                        </Button>
                                                        <Button
                                                            color={!item.variant.product.is_active ? "danger" : "secondary"}
                                                            onClick={() => handleStatusChange(item.id, "Remove")}
                                                        >
                                                            Out of Stock
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            )) : (
                                                <Tr>
                                                    <Td colSpan="6">No inventory data available.</Td>
                                                </Tr>
                                            )}
                                        </Tbody>
                                    </Table>
                                </div>
                            </div>
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
    )
}

export default connect(null, { setBreadcrumbItems })(InventoryTable);