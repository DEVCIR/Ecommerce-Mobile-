import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import * as XLSX from "xlsx";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const InventoryUpload = (props) => {
  document.title = "Products Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  
  const [showAddExcel, setShowAddExcel] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

 
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  
  const [showFetchImagesButton, setShowFetchImagesButton] = useState(false);

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Tables", link: "#" },
    { title: "Products Table", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Products Table", breadcrumbItems);
  }, [showAddExcel]);

 
  const handleShowExcelForm = () => {
    setShowAddExcel(true);
   
    setExcelFile(null);
    setExcelData([]);
  };

  const handleBackToTable = () => {
    setShowAddExcel(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };





  const handleImportExcel = () => {
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryStr = evt.target.result;
        const wb = XLSX.read(binaryStr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
       
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length > 1) {
          const headers = data[0].map((h) => h.trim());
          const rows = data.slice(1);
          const formattedData = rows.map((row) => {
            let obj = {};
            
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return {
              brand_name: String(obj.BrandName || ""),
              color: String(obj.Color || ""),
              condition: String(obj.Condition || ""),
              product_description: String(obj.Description || ""),
              discount_price: parseFloat(obj.DiscountAmount) || 0,
              discount_type: String(obj.DiscountType || ""),
              all_imageUrls: [], 
              feature_imageUrl: null, 
              storage_gb: parseInt(obj.GB || ""),
              imei: String(obj.IMEI || ""),
              model_name: String(obj.Model || ""),
              network_type: String(obj.Network || ""),
              purchase_price: parseFloat(obj.PurchasePrice) || 0,
              sku: String(obj.SKU || ""),
              selling_price: parseFloat(obj.SellingPrice) || 0,
              quantity: parseFloat(obj.stockQuantity) || 1,
              serial_no: String(obj.SerialNo || ""),
              barcode: String(obj.barcode || ""),
              stock_status: String(obj.Status === "Available" ? "In Stock" : obj.Status || "In Stock"),
              supplier_id: parseInt(obj.SupplierID, 10) || 0
            };
          });
          setExcelData(formattedData);
          setShowFetchImagesButton(true); 
        }
      };
      reader.readAsBinaryString(excelFile);
    }
  };

 
  const toggleConfirmDeleteModal = () => setConfirmDeleteModal(!confirmDeleteModal);

  const handleDeleteRowRequest = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    toggleConfirmDeleteModal();
  };

  const handleConfirmDeleteRow = () => {
    setExcelData(prevData => prevData.filter((_, index) => index !== selectedRowIndex));
    setSelectedRowIndex(null);
    toggleConfirmDeleteModal();
  };

  const handleCancelDelete = () => {
    setSelectedRowIndex(null);
    toggleConfirmDeleteModal();
  };

  
  const handleSubmitProducts = async () => {
    if (excelData.length === 0) return;
    let successCount = 0;
    let failCount = 0;

    for (const product of excelData) {
      try {
        const formData = new FormData();
        
      
        for (const [key, value] of Object.entries(product)) {
          if (key === 'all_imageUrls') {
            
            value.forEach((file, index) => {
              formData.append(`all_imageUrls[]`, file); 
            });
          } else {
            formData.append(key, value);
          }
        }

        const response = await fetch(`${BASE_URL}/inventory`, {
          method: "POST",
          body: formData 
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error("Error adding product:", error);
        failCount++;
      }
    }

    if (failCount === 0) {
      toast.success(`All ${successCount} products added successfully!`);
    } else {
      toast.error(`Products added: ${successCount}, Failures: ${failCount}`);
    }
    
    setExcelData([]);
  };

  const handleFetchProductImages = async () => {
    for (const product of excelData) {
      const { brand_name, model_name } = product;
      if (brand_name && model_name) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/scrape-phone?name=${brand_name} ${model_name}`);
          const data = await response.json();

          // Get image URLs
          const imageUrls = data.ImageGallery || [];
          const imageFiles = await Promise.all(
            imageUrls.map(async (url, index) => {
              const proxyUrl = `http://127.0.0.1:5000/download-image?url=${encodeURIComponent(url)}`;
              const imageResponse = await fetch(proxyUrl);
              const blob = await imageResponse.blob();
              const ext = "jpg"; // Assuming all images are jpg

              return new File([blob], `image_${index}.${ext}`, { type: blob.type });
            })
          );

          
          setExcelData(prevData => 
            prevData.map((item, idx) => 
              idx === excelData.indexOf(product) ? { ...item, feature_imageUrl: imageFiles[0], all_imageUrls: imageFiles } : item
            )
          );

        } catch (error) {
          console.error("Error fetching phone specs:", error);
          toast.error("Error fetching phone specs");
        }
      } else {
        toast.error("Please enter both Brand Name and Model Name");
      }
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* Header Section */}
              {!showAddExcel ? (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Products Table</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="success" onClick={handleShowExcelForm}>
                      Add Excel
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row className="align-items-center mb-3">
                  <Col>
                    <CardTitle className="h4">Import Excel File</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="secondary" onClick={handleBackToTable}>
                      Back to Table
                    </Button>
                  </Col>
                </Row>
              )}

              {/* Excel Import Form */}
              {showAddExcel && (
                <React.Fragment>
                  <Row className="mb-3">
                    <Col md={12}>
                      <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col className="text-end">
                      <Button color="primary" onClick={handleImportExcel}>
                        Import
                      </Button>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {/* Display Imported Data */}
              {excelData.length > 0 ? (
                <React.Fragment>
                  <CardTitle className="h5">Imported Data</CardTitle>
                  <div className="table-rep-plugin">
                    <div className="table-responsive mb-0" data-pattern="priority-columns">
                      <Table className="table table-striped table-bordered">
                        <Thead>
                          <Tr>
                            {Object.keys(excelData[0]).map((header, index) => (
                              <Th key={index}>{header}</Th>
                            ))}
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {excelData.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {Object.entries(row).map(([key, cell], cellIndex) => {
                                // Check if the cell is an image file and render it accordingly
                                if (cell instanceof File) {
                                  return (
                                    <Td key={cellIndex}>
                                      <img src={URL.createObjectURL(cell)} alt="Feature" style={{ width: '50px', height: 'auto' }} />
                                    </Td>
                                  );
                                }
                                // Ensure we don't render the File object directly
                                return <Td key={cellIndex}>{typeof cell === 'string' ? cell : "N/A"}</Td>;
                              })}
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
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                  {/* "Add these products" button */}
                  <Row className="mt-3">
                    <Col className="text-end">
                      <Button color="primary" onClick={handleSubmitProducts}>
                        Add These Products
                      </Button>
                      {showFetchImagesButton && ( 
                        <Button color="info" onClick={handleFetchProductImages} className="ms-2">
                          Fetch Product Images
                        </Button>
                      )}
                    </Col>
                  </Row>
                </React.Fragment>
              ) : (
                showAddExcel && (
                  <Row>
                    <Col>
                      <p>No data imported yet. Please choose an Excel file and click Import.</p>
                    </Col>
                  </Row>
                )
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      
      <Modal isOpen={confirmDeleteModal} toggle={toggleConfirmDeleteModal}>
        <ModalHeader toggle={toggleConfirmDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this row?
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
      <Toaster />
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(InventoryUpload);