import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import * as XLSX from "xlsx";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const UploadSupplier = (props, setViewToTable) => {
  document.title = "Supplier Upload | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [email, setEmail] = useState([]);
  const [existingSuppliers, setExistingSuppliers] = useState([]);

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Suppliers", link: "#" },
    { title: "Supplier Upload", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Supplier Upload", breadcrumbItems);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  const handleDeleteRow = (index) => {
    const newExcelData = [...excelData];
    newExcelData.splice(index, 1);
    setExcelData(newExcelData);
    
    const newUserNames = [...userNames];
    newUserNames.splice(index, 1);
    setUserNames(newUserNames);
    
    const newEmails = [...email];
    newEmails.splice(index, 1);
    setEmail(newEmails);
    
    toast.info('Row removed successfully');
  };

  const fetchSupplierData = async (supplier_name, supplier_email) => {
    try {
      const response = await fetch(`${BASE_URL}/users?name=${supplier_name}&email=${supplier_email}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      return null;
    }
  };

  const handlePrintNamesAndEmails = async () => {
    setIsProcessing(true);
    setExistingSuppliers([]); 
    let anySuccess = false;
    
    for (let i = 0; i < userNames.length; i++) {
      const name = userNames[i];
      const emailAddr = email[i];
      const excelRow = excelData[i];
      
      try {
        const userData = await fetchSupplierData(name, emailAddr);
        
        let userId;
        let userToAdd;
        
        if (userData?.data?.length > 0) {
          userToAdd = userData.data[0];
          userId = userToAdd.id;
          console.log(`User found: ${name} (${emailAddr}) with ID: ${userId}`);
        } else {
          console.log(`User not found, creating new user: ${name} (${emailAddr})`);
          
          try {
            const newUser = {
              name: name,
              email: emailAddr,
              password: "supplier123",
              role: "supplier"
            };
            
            const userResponse = await fetch(`${BASE_URL}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newUser)
            });
            
            if (!userResponse.ok) {
              throw new Error(`HTTP error! status: ${userResponse.status}`);
            }
            
            const responseData = await userResponse.json(); 
            userToAdd = responseData.user;
            userId = userToAdd.id; 
            console.log('Successfully created user:', userToAdd);
          } catch (userError) {
            console.error('Error creating user:', userError);
            continue;
          }
        }

        if (userToAdd) {
          setExistingSuppliers(prev => [...prev, userToAdd]);
        }
        
        if (!userId) {
          console.error('No user ID available for supplier creation');
          continue;
        }
        
        const supplierData = {
          user_id: userId,
          contact_person: excelRow.contact_person || '',
          address: excelRow.address || '',
          tax_id: excelRow.tax_id ? String(excelRow.tax_id) : null,
          payment_terms: excelRow.payment_terms || '',
          notes: excelRow.notes || ''
        };
        
        console.log('Prepared supplier data:', supplierData);
        
        try {
          const supplierResponse = await fetch(`${BASE_URL}/suppliers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierData)
          });
          
          if (!supplierResponse.ok) {
            const errorResponse = await supplierResponse.json();
            console.error('Supplier creation failed:', errorResponse);
            throw new Error(`HTTP error! status: ${supplierResponse.status}`);
          }
          
          const supplierResult = await supplierResponse.json();
          console.log('Successfully created supplier:', supplierResult);
        } catch (supplierError) {
          console.error('Error creating supplier:', supplierError);
        }
        anySuccess = true;
        
      } catch (error) {
        console.error(`Error processing ${name}:`, error);
      }
    }
    
    setIsProcessing(false);
    if (anySuccess) {
      toast.success("Supplier processing completed!");
      toast.success("Supplier added successfully");
      setTimeout(() => {
        props.setViewToTable(); 
      }, 1500);
    } else {
      toast.error("No suppliers were processed successfully");
    }
  };

  const handleImportExcel = () => {
    if (!excelFile) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const wb = XLSX.read(binaryStr, { type: "binary", cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      if (data.length > 0) {
        const excelHeaders = data[0].map(header => header.trim());
        setHeaders([...excelHeaders, 'Action']); 
        
        const formattedData = data.slice(1)
          .filter(row => row.some(cell => cell != null && cell !== ''))
          .map(row => {
            return excelHeaders.reduce((obj, header, index) => {
              obj[header] = row[index] ?? '';
              return obj;
            }, {});
          });
      
        setExcelData(formattedData);
        setUserNames(formattedData.map(item => item.user_name || ''));
        setEmail(formattedData.map(item => item.email || ''));
        
        toast.success("Excel imported!");
      }
      setIsProcessing(false);
    };
    reader.readAsBinaryString(excelFile);
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row className="align-items-center mb-3">
                <Col>
                  <CardTitle className="h4">Supplier Upload</CardTitle>
                </Col>
                <Col className="text-end">
                  <Button color="secondary" onClick={props.onBackClick}>
                    Back to Suppliers
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileChange} 
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col className="text-end">
                  <Button 
                    color="primary" 
                    onClick={handleImportExcel} 
                    disabled={isProcessing || !excelFile}
                    className="me-2"
                  >
                    {isProcessing ? 'Processing...' : 'Import Excel'}
                  </Button>
                  <Button 
                    color="success" 
                    onClick={handlePrintNamesAndEmails}
                    disabled={isProcessing || userNames.length === 0}
                  >
                    {isProcessing ? 'Checking...' : 'Add Supplier'}
                  </Button>
                </Col>
              </Row>

              {excelData.length > 0 && (
                <>
                  <CardTitle className="h5">Imported Data</CardTitle>
                  <div className="table-responsive">
                    <Table className="table table-striped table-bordered">
                      <Thead>
                        <Tr>
                          {headers.map((header, index) => (
                            <Th key={index}>{header}</Th>
                          ))}
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {excelData.map((row, rowIndex) => (
                          <Tr key={rowIndex}>
                            {headers.map((header, cellIndex) => (
                              <Td key={cellIndex}>
                                {row[header] || 'N/A'}
                              </Td>
                            ))}
                            <Td>
                              <Button 
                                color="danger" 
                                size="sm" 
                                onClick={() => handleDeleteRow(rowIndex)}
                              >
                                Delete
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Toaster position="top-right" richColors />
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(UploadSupplier);


















