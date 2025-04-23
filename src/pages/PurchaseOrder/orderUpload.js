import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
  Badge
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import * as XLSX from "xlsx";
import { Toaster, toast } from "sonner";
import { BASE_URL } from '../../Service';

const PurchaseOrderUpload = ({ onBackClick }) => {
  document.title = "Purchase Orders | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [showAddExcel, setShowAddExcel] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [supplierIds, setSupplierIds] = useState({}); // Store resolved supplier IDs

  // Fetch suppliers and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch suppliers
        const suppliersResponse = await fetch(`${BASE_URL}/suppliers`);
        const suppliersData = await suppliersResponse.json();
        if (suppliersData.data && suppliersData.data.data) {
          setSuppliers(suppliersData.data.data);
        }

        // Fetch users
        const usersResponse = await fetch(`${BASE_URL}/users`);
        const usersData = await usersResponse.json();
        if (usersData.data) {
          setUsers(usersData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Resolve supplier IDs when excelData changes
  useEffect(() => {
    const resolveSupplierIds = async () => {
      const newSupplierIds = {};
      for (const [index, row] of excelData.entries()) {
        const supplierId = await findSupplierId(row.supplier_name, row.supplier_email);
        newSupplierIds[index] = supplierId;
      }
      setSupplierIds(newSupplierIds);
    };

    if (excelData.length > 0) {
      resolveSupplierIds();
    }
  }, [excelData, suppliers, users]);

  const createSupplierWithUser = async (supplierName, email) => {
    try {
      // Check if user already exists
      const userSearchResponse = await fetch(
        `${BASE_URL}/users?email=${encodeURIComponent(email)}`
      );

      if (!userSearchResponse.ok) throw new Error("User search failed");
      const userSearchData = await userSearchResponse.json();

      let userId;
      // If user exists, use existing ID
      if (userSearchData.data && userSearchData.data.length > 0) {
        userId = userSearchData.data[0].id;
      } else {
        // Create new user
        const userResponse = await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: supplierName,
            email: email,
            password: "Supplier123",
            role: "supplier",
            is_active: true
          })
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          // Handle email conflict race condition
          if (errorData.errors?.email?.[0]?.includes("taken")) {
            const retryUser = await fetch(
              `${BASE_URL}/users?email=${encodeURIComponent(email)}`
            ).then(res => res.json());
            if (retryUser.data?.length) {
              userId = retryUser.data[0].id;
            } else {
              throw new Error("Email conflict but user not found");
            }
          } else {
            throw new Error(errorData.message || "User creation failed");
          }
        } else {
          const userData = await userResponse.json();
          userId = userData.user.id;
        }
      }

      // Create supplier
      const supplierResponse = await fetch(`${BASE_URL}/suppliers`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          contact_person: supplierName,
          is_active: true
        })
      });

      if (!supplierResponse.ok) {
        const errorData = await supplierResponse.json();
        throw new Error(errorData.message || "Supplier creation failed");
      }

      const supplierData = await supplierResponse.json();
      return {
        supplierId: supplierData.id,
        userId,
        email
      };

    } catch (error) {
      console.error("Supplier creation error:", error);
      throw new Error(`Supplier creation failed: ${error.message}`);
    }
  };


  const findSupplierId = async (supplierName, email) => {
    if (!supplierName) return null;

    // First try to find existing supplier
    const supplier = suppliers.find(s =>
      s.user?.name?.toLowerCase() === supplierName.toLowerCase() ||
      `${s.user?.name || ''} ${s.user?.last_name || ''}`.trim().toLowerCase() === supplierName.toLowerCase()
    );

    if (supplier) return supplier.id;

    // If not found, create new supplier and user in one request
    try {
      toast.info(`Creating new supplier: ${supplierName}`);

      const { userId, supplierId } = await createSupplierWithUser(supplierName, email);

      // Update local state
      const newUser = { id: userId, name: supplierName, role: "supplier" };
      const newSupplier = { id: supplierId, user_id: userId, user: newUser };

      setUsers(prev => [...prev, newUser]);
      setSuppliers(prev => [...prev, newSupplier]);

      toast.success(`Successfully created new supplier: ${supplierName}`);
      return supplierId;
    } catch (error) {
      console.error("Error in supplier creation process:", error);
      toast.error(`Failed to create supplier: ${supplierName}`);
      return null;
    }
  };

  const findUserId = (userName) => {
    if (!userName) return null;

    // Try to find by ID first (in case created_by contains ID)
    if (!isNaN(userName)) {
      const userById = users.find(u => u.id == userName);
      if (userById) return userById.id;
    }

    // Then try to find by name
    const user = users.find(u =>
      u.name?.toLowerCase() === userName.toLowerCase() ||
      `${u.name || ''} ${u.last_name || ''}`.trim().toLowerCase() === userName.toLowerCase()
    );
    return user ? user.id : null;
  };

  const validateRow = (row, index) => {
    const errors = {};

    // Check required fields
    if (!row.po_number) errors.po_number = "PO Number is required";
    if (!row.order_date) errors.order_date = "Order Date is required";
    if (!row.status) errors.status = "Status is required";
    if (!row.created_by) errors.created_by = "Created By is required";

    // Validate dates
    if (row.order_date && isNaN(new Date(row.order_date))) {
      errors.order_date = "Invalid date format";
    }
    if (row.expected_delivery_date && isNaN(new Date(row.expected_delivery_date))) {
      errors.expected_delivery_date = "Invalid date format";
    }

    // Validate numbers
    if (row.total_amount && isNaN(row.total_amount)) {
      errors.total_amount = "Must be a number";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleShowExcelForm = () => {
    setShowAddExcel(true);
    setExcelFile(null);
    setExcelData([]);
    setValidationErrors({});
    setSupplierIds({});
  };

  const handleBackToTable = () => {
    setShowAddExcel(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  const handleImportExcel = () => {
    if (!excelFile) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target.result;
        const wb = XLSX.read(binaryStr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length <= 1) {
          toast.warning("No data found in the Excel file");
          return;
        }

        const headers = data[0].map((h) => h?.trim() || "");
        const rows = data.slice(1);

        // Filter out empty rows and validate data
        const errors = {};
        const formattedData = rows
          .map((row, rowIndex) => {
            // Skip empty rows
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
              return null;
            }

            // Create object from row data
            let obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });

            return {
              supplier_name: String(obj.supplier_name || ""),
              supplier_email: String(obj.email || ""),
              po_number: String(obj.po_number || ""),
              order_date: String(obj.order_date || ""),
              expected_delivery_date: String(obj.expected_delivery_date || ""),
              status: String(obj.status || "Draft"),
              Sku: String(obj.Sku || ""),
              quantity: parseInt(obj.Quantity) || 1,
              total_amount: parseFloat(obj.total_amount) || 0,
              notes: String(obj.notes || ""),
              created_by: String(obj.created_by || ""),
              is_active: true
            };
          })
          .filter(row => row !== null)
          .map((row, index) => {
            const rowErrors = validateRow(row, index);
            if (rowErrors) {
              errors[index] = rowErrors;
            }
            return row;
          });

        setExcelData(formattedData);
        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
          toast.warning("Some rows have validation errors. Please check before submitting.");
        } else if (formattedData.length > 0) {
          toast.success(`Successfully imported ${formattedData.length} purchase orders`);
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        toast.error("Failed to process Excel file");
      }
    };
    reader.readAsBinaryString(excelFile);
  };

  const toggleConfirmDeleteModal = () => setConfirmDeleteModal(!confirmDeleteModal);

  const handleDeleteRowRequest = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    toggleConfirmDeleteModal();
  };

  const handleConfirmDeleteRow = () => {
    setExcelData(prevData => prevData.filter((_, index) => index !== selectedRowIndex));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[selectedRowIndex];
      return newErrors;
    });
    setSupplierIds(prev => {
      const newIds = { ...prev };
      delete newIds[selectedRowIndex];
      return newIds;
    });
    setSelectedRowIndex(null);
    toggleConfirmDeleteModal();
  };

  const handleCancelDelete = () => {
    setSelectedRowIndex(null);
    toggleConfirmDeleteModal();
  };


  const handleSubmitPurchaseOrders = async () => {
    if (excelData.length === 0) return;
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    // Group rows by PO number
    const poGroups = excelData.reduce((acc, row) => {
      const key = row.po_number;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    for (const [poNumber, poRows] of Object.entries(poGroups)) {
      try {
        // Validate PO group consistency
        const firstRow = poRows[0];
        const consistentFields = ['supplier_name', 'created_by', 'order_date'];
        const isConsistent = poRows.every(row =>
          consistentFields.every(field => row[field] === firstRow[field])
        );

        if (!isConsistent) {
          throw new Error("Inconsistent data in PO group (supplier, creator, or dates)");
        }

        // Process supplier and user (using first row)
        const supplierId = supplierIds[excelData.indexOf(firstRow)];
        if (!supplierId) throw new Error(`Supplier "${firstRow.supplier_name}" not found`);

        const userId = findUserId(firstRow.created_by);
        if (!userId) throw new Error(`User "${firstRow.created_by}" not found`);

        // Collect items data and calculate total
        let poTotal = 0;
        const itemsData = await Promise.all(
          poRows.map(async (row, index) => {
            // Fetch inventory data
            if (!row.Sku) throw new Error(`Row ${index + 1}: SKU is required`);
            const inventoryResponse = await fetch(
              `${BASE_URL}/inventory?sku=${encodeURIComponent(row.Sku)}`
            );

            if (!inventoryResponse.ok) throw new Error("Inventory fetch failed");
            const inventoryData = await inventoryResponse.json();

            if (!inventoryData?.data?.data?.length) {
              throw new Error(`No inventory found for SKU: ${row.Sku}`);
            }

            const inventoryItem = inventoryData.data.data[0];
            const productId = inventoryItem.variant?.product?.id;
            const variantId = inventoryItem.variant?.id;
            const unitPrice = parseFloat(inventoryItem.purchase_price);
            const quantity = row.quantity || 1;

            if (!productId || !variantId) {
              throw new Error("Invalid product/variant data");
            }

            const itemTotal = quantity * unitPrice;
            poTotal += itemTotal;

            return {
              productId,
              variantId,
              quantity,
              unitPrice,
              itemTotal,
              sku: row.Sku,
              notes: row.notes
            };
          })
        );

        // Create purchase order
        const poPayload = {
          supplier_id: supplierId,
          created_by: userId,
          po_number: poNumber,
          order_date: new Date(firstRow.order_date).toISOString(),
          expected_delivery_date: firstRow.expected_delivery_date
            ? new Date(firstRow.expected_delivery_date).toISOString()
            : null,
          status: firstRow.status || "draft",
          notes: firstRow.notes,
          total_amount: poTotal,
          is_active: true
        };

        const poResponse = await fetch(`${BASE_URL}/purchase-orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(poPayload)
        });

        if (!poResponse.ok) {
          const errorData = await poResponse.json();
          throw new Error(errorData.message || "PO creation failed");
        }

        const poData = await poResponse.json();

        // Create purchase order items
        await Promise.all(
          itemsData.map(async (item) => {
            const itemPayload = {
              po_id: poData.id,
              product_id: item.productId,
              variant_id: item.variantId,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              total_price: item.itemTotal,
              notes: item.notes,
              is_active: true
            };

            const itemResponse = await fetch(`${BASE_URL}/purchase-order-items`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(itemPayload)
            });

            if (!itemResponse.ok) {
              const errorData = await itemResponse.json();
              throw new Error(`Item creation failed: ${errorData.message}`);
            }
          })
        );

        successCount++;
      } catch (error) {
        console.error(`Error processing PO ${poNumber}:`, error);
        errors.push(`PO ${poNumber}: ${error.message}`);
        failCount++;
      }
    }

    setIsSubmitting(false);

    // Show results
    if (failCount === 0) {
      toast.success(`Successfully processed ${successCount} purchase orders`);
      setExcelData([]);
      setValidationErrors({});
      setSupplierIds({});
    } else {
      toast.error(
        <div>
          <p>Completed with errors ({successCount} success, {failCount} fails)</p>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {errors.map((error, i) => (
              <p key={i} style={{ fontSize: "12px", margin: "2px 0" }}>{error}</p>
            ))}
          </div>
        </div>,
        { duration: 10000 }
      );
    }
  };

  const getErrorForCell = (rowIndex, fieldName) => {
    return validationErrors[rowIndex]?.[fieldName];
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              {!showAddExcel ? (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Purchase Orders</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2">
                      Back to Table
                    </Button>
                    <Button color="success" onClick={handleShowExcelForm}>
                      Add Excel
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Import Purchase Orders</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="secondary" onClick={handleBackToTable}>
                      Back to Table
                    </Button>
                  </Col>
                </Row>
              )}

              {isLoading && (
                <Row className="mb-3">
                  <Col>
                    <Alert color="info">
                      <Spinner size="sm" /> Loading required data...
                    </Alert>
                  </Col>
                </Row>
              )}

              {showAddExcel && (
                <React.Fragment>
                  <Row className="mb-3">
                    <Col md={12}>
                      <Input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                      <small className="text-muted">
                        Upload an Excel file with purchase order data
                      </small>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col className="text-end">
                      <Button
                        color="primary"
                        onClick={handleImportExcel}
                        disabled={isLoading || !excelFile}
                      >
                        {isLoading ? 'Loading...' : 'Import'}
                      </Button>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {excelData.length > 0 && (
                <React.Fragment>
                  <Row className="mb-3">
                    <Col>
                      <CardTitle className="h5">Imported Purchase Orders</CardTitle>
                      <Badge color="info" className="me-2">
                        Total: {excelData.length}
                      </Badge>
                      <Badge color={Object.keys(validationErrors).length > 0 ? "danger" : "success"}>
                        Errors: {Object.keys(validationErrors).length}
                      </Badge>
                    </Col>
                  </Row>

                  <div className="table-rep-plugin">
                    <div className="table-responsive mb-0" data-pattern="priority-columns">
                      <Table className="table table-striped table-bordered">
                        <Thead>
                          <Tr>
                            <Th>#</Th>
                            <Th>Supplier</Th>
                            <Th>PO Number</Th>
                            <Th>Order Date</Th>
                            <Th>Expected Delivery</Th>
                            <Th>Status</Th>
                            <Th>Sku</Th>
                            {/* <Th>Amount</Th> */}
                            <Th>Created By</Th>
                            <Th>Notes</Th>
                            {/* <Th>Supplier ID</Th> */}
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {excelData.map((row, rowIndex) => {
                            const supplierId = supplierIds[rowIndex];
                            const userId = findUserId(row.created_by);
                            const rowErrors = validationErrors[rowIndex];
                            const hasErrors = rowErrors && Object.keys(rowErrors).length > 0;

                            return (
                              <Tr key={rowIndex} className={hasErrors ? "table-warning" : ""}>
                                <Td>{rowIndex + 1}</Td>
                                <Td>
                                  {row.supplier_name}
                                  {getErrorForCell(rowIndex, 'supplier_name') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'supplier_name')}
                                    </div>
                                  )}
                                </Td>
                                <Td>
                                  {row.po_number}
                                  {getErrorForCell(rowIndex, 'po_number') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'po_number')}
                                    </div>
                                  )}
                                </Td>
                                <Td>
                                  {formatDateDisplay(row.order_date)}
                                  {getErrorForCell(rowIndex, 'order_date') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'order_date')}
                                    </div>
                                  )}
                                </Td>
                                <Td>
                                  {formatDateDisplay(row.expected_delivery_date)}
                                  {getErrorForCell(rowIndex, 'expected_delivery_date') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'expected_delivery_date')}
                                    </div>
                                  )}
                                </Td>
                                <Td>
                                  {row.status}
                                  {getErrorForCell(rowIndex, 'status') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'status')}
                                    </div>
                                  )}
                                </Td>
                                <Td>
                                  {row.Sku}
                                  {getErrorForCell(rowIndex, 'Sku') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'Sku')}
                                    </div>
                                  )}
                                </Td>
                                {/* <Td>
                                  {row.total_amount}
                                  {getErrorForCell(rowIndex, 'total_amount') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'total_amount')}
                                    </div>
                                  )}
                                </Td> */}
                                <Td>
                                  {row.created_by}
                                  {getErrorForCell(rowIndex, 'created_by') && (
                                    <div className="text-danger small">
                                      {getErrorForCell(rowIndex, 'created_by')}
                                    </div>
                                  )}
                                </Td>
                                <Td>{row.notes}</Td>
                                {/* <Td>
                                  {supplierId ? (
                                    <Badge color="success">{supplierId}</Badge>
                                  ) : (
                                    <Badge color="danger">Not found</Badge>
                                  )}
                                </Td> */}
                                <Td>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteRowRequest(rowIndex)}
                                  >
                                    Delete
                                  </Button>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </div>
                  </div>

                  <Row className="mt-3">
                    <Col className="text-end">
                      <Button
                        color="primary"
                        onClick={handleSubmitPurchaseOrders}
                        disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size="sm" /> Submitting...
                          </>
                        ) : (
                          'Submit Purchase Orders'
                        )}
                      </Button>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {showAddExcel && excelData.length === 0 && (
                <Row>
                  <Col>
                    <Alert color="info">
                      No data imported yet. Please choose an Excel file and click Import.
                    </Alert>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={confirmDeleteModal} toggle={toggleConfirmDeleteModal}>
        <ModalHeader toggle={toggleConfirmDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this purchase order?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDeleteRow}>
            Delete
          </Button>
          <Button color="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Toaster richColors position="top-right" />
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(PurchaseOrderUpload);