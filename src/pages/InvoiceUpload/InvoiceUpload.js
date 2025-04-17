// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap";
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
// import { connect } from "react-redux";
// import { setBreadcrumbItems } from "../../store/actions";
// import * as XLSX from "xlsx";
// import { Toaster, toast } from "sonner";

// const InvoiceUpload = (props) => {
//   document.title = "Invoice Upload | Lexa - Responsive Bootstrap 5 Admin Dashboard";

//   const [showAddExcel, setShowAddExcel] = useState(false);
//   const [excelFile, setExcelFile] = useState(null);
//   const [excelData, setExcelData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [customerName, setCustomerName] = useState();
//   const [customerEmail, setCustomerEmail] = useState();
//   const [productModel, setProductModel] = useState();
//   const [productName, setProductName] = useState();
//   const [productPrice, setProductPrice] = useState();
//   const [excelquantity, setExcelQuantity] = useState();
//   const [excelColor, setExcelColor] = useState();
//   const [date, setDate] = useState();

//   const [color, setColor] = useState([]);
//   const [quantity, setQuantity] = useState([]);
//   const [storageGb, setStorageGb] = useState([]);
//   const [stockStatus, setStockStatus] = useState([]);
//   const [location, setLocation] = useState([]);
//   const [sku, setSku] = useState([]);
//   const [image, setImage] = useState([]);
//   const [customerID, setCustomerID] = useState([]);
//   const [existingBrandID, setExistingBrandID] = useState('');
//   const [inventoryData, setInventoryData] = useState([]);
//   const [productID,setProductID]=useState()
//   const [customerTableId,setCustomerTableId]=useState();
//   const [inventoryID, setInventoryID] = useState();

//   const breadcrumbItems = [
//     { title: "Lexa", link: "#" },
//     { title: "Invoices", link: "#" },
//     { title: "Invoice Upload", link: "#" },
//   ];

//   useEffect(() => {
//     props.setBreadcrumbItems("Invoice Upload", breadcrumbItems);
//   }, []);

//   const handleShowExcelForm = () => {
//     setShowAddExcel(true);
//     setExcelFile(null);
//     setExcelData([]);
//   };

//   const handleBackToTable = () => {
//     setShowAddExcel(false);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setExcelFile(file);
//   };

//   // Function to fetch inventory data for a product model
//   const fetchInventoryData = async (model) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/inventory?model_name=${model}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error(`Error fetching inventory data for model ${model}:`, error);
//       return null;
//     }
//   };

//   const fetchCustomerData= async (cus_name,cus_email) => {
//     try {
//       // const response = await fetch(`http://localhost:8000/api/users?name=${cus_name}`);
//       const response = await fetch(`http://localhost:8000/api/users?name=${cus_name}&email=${cus_email}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//     //   console.error(`Error fetching inventory data for model ${cus_name}:`, error);
//       return null;
//     }
//   };



//   const fetchCustomerIDFromTable= async (cus_id) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/customers?user_id=${cus_id}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//     //   console.error(`Error fetching inventory data for model ${cus_name}:`, error);
//       return null;
//     }
//   };


//   const handleImportExcel = () => {
//     if (excelFile) {
//       const reader = new FileReader();
//       reader.onload = async (evt) => {
//         const binaryStr = evt.target.result;
//         const wb = XLSX.read(binaryStr, { type: "binary", cellDates: true  });
//         const wsname = wb.SheetNames[0];
//         const ws = wb.Sheets[wsname];
//         const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
//         if (data.length > 0) {
//           const excelHeaders = data[0].map(header => header.trim());
//           setHeaders(excelHeaders);
          
//           const formattedData = data.slice(1).map(row => {
//             let obj = {};
//             excelHeaders.forEach((header, index) => {
              
//               obj[header] = row[index] !== undefined ? row[index] : '';
//             });
//             return obj;
//           });
          
//           setExcelData(formattedData);

      
//           const productModels = formattedData.map(item => item.product_model);
//           const productNames = formattedData.map(item => item.product_name);
//           const excelquantities = formattedData.map(item => item.quantity);
//           const product_p =formattedData.map(item => item.product_price)
//           const customer= formattedData.map(item => item.customer_name);
//           const cusEmail= formattedData.map(item => item.customer_email);
//           const color=formattedData.map(item => item.color);
//           const date=formattedData.map(item => item.date);
          

//           setProductModel(productModels);
//           setProductName(productNames);
//           setCustomerName(customer)
//           setCustomerEmail(cusEmail)
//           setProductPrice(product_p)
//           setExcelQuantity(excelquantities[0])
//           setExcelColor(color)
//           setDate(date);

// console.log("Product Models:", productModels);
// console.log("Product Names:", productNames);
// console.log("Quantities:", excelquantities);
// console.log("Product Prices:", product_p);
// console.log("Customer Names:", customer);
// console.log("Colors:", color);
// console.log("Customer Email: ",cusEmail);
// console.log("Date", date);

//           try {
//             setIsProcessing(true);
//             const uniqueProductNames = [...new Set(productNames.filter(name => name))];
            
//             // First process brands
//             for (const productName of uniqueProductNames) {
//               console.log("name:", productName);
//               const searchResponse = await fetch(`http://localhost:8000/api/brands/search?query=${productName}`);
//               const searchData = await searchResponse.json();
//               console.log("search data", searchData);
//               if (searchData) {               
//                 const existingBrandID = searchData.data[0].id;
//                 console.log("Brand Id", existingBrandID);
//                 setExistingBrandID(existingBrandID);
//               } else {
//                 console.log("Else")
//                 // Brand doesn't exist - create it
//                 try {
//                   const createResponse = await fetch('http://localhost:8000/api/brands', {
//                     method: 'POST',
//                     headers: {
//                       'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                       brand_name: productName,
//                     }),
//                   });
                  
//                   if (!createResponse.ok) {
//                     throw new Error(`Failed to create brand: ${createResponse.status}`);
//                   }
                  
//                   const createdBrand = await createResponse.json();
//                   console.log("New Brand", createdBrand);
//                   const newBrandId = createdBrand.data.id;
//                   setExistingBrandID(newBrandId);
//                 } catch (error) {
//                   console.error(`Error creating brand "${productName}":`, error);
//                   toast.error(`Error creating brand "${productName}"`, {
//                     position: "top-right"
//                   });
//                 }
//               }
//             }
            
//             const uniqueProductModels = [...new Set(productModels.filter(model => model))];
//             const inventoryResults = [];
            
//             for (const model of uniqueProductModels) {
//               const inventoryData = await fetchInventoryData(model);
//               if (inventoryData) {
//                 console.log(`Inventory data for model ${model}:`, inventoryData.data.data[0]);
//                 setInventoryID(inventoryData.data.data[0].id)
//                 setProductID(inventoryData.data.data[0].variant.product.id)
//                 setSku(inventoryData.data.data[0].variant.product.sku)
//                 setStockStatus(inventoryData.data.data[0].stock_status)
//                 setColor(inventoryData.data.data[0].variant.color)
//                 setStorageGb(inventoryData.data.data[0].variant.storage_gb)
//                 setQuantity(inventoryData.data.data[0].variant.product.quantity)
//                 setImage(inventoryData.data.data[0].variant.product.feature_imageUrl)
               
//               }
//             }
         
//     const CustomerData = await fetchCustomerData(customer,cusEmail);

//           if (CustomerData.data.length > 0) {
//             const existingCustomerID = CustomerData.data[0].id;
//             console.log(`Data for user:`, existingCustomerID);  

//             const CustomerIDFinder= await fetchCustomerIDFromTable(existingCustomerID);
//             console.log("Data to find ID",CustomerIDFinder.data.data[0].id);
//             const CustomerRowID=CustomerIDFinder.data.data[0].id;
//             setCustomerTableId(CustomerRowID);
//             setCustomerID(existingCustomerID);
//             console.log("My Excel User:", customer[0]);
//           }
//           else if (CustomerData.data.length === 0) {
//             console.log("My Excel User:", customer[0]);
          
//             try {
//               const createResponse = await fetch('http://localhost:8000/api/users', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   name: customer[0],
//                   email: cusEmail[0],
//                   password: "customer123",
//                   role: "customer"
//                 }),
//               });
              
//               if (!createResponse.ok) {
//                 throw new Error(`Failed to create customer: ${createResponse.status}`);
//               }
              
//               const createdCustomer = await createResponse.json();
//               console.log("New User Created:", createdCustomer);
//               const newCustomerId = createdCustomer.user.id;
//               setCustomerID(newCustomerId);              
//               // Now post to the customers table with the user_id
//               const customerPostResponse = await fetch('http://localhost:8000/api/customers', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   user_id: newCustomerId,
//                   customer_type: "Retail"
//                 }),
//               });
              
//               if (!customerPostResponse.ok) {
//                 throw new Error(`Failed to add customer to customers table: ${customerPostResponse.status}`);
//               }
              
//               const customerData = await customerPostResponse.json();

//               console.log("New Customer Added to Customers Table:", customerData);
//               setCustomerTableId(customerData.id)
//               setCustomerID(newCustomerId);

//               console.log("Else if , User created, Customer Created")
//             } catch (error) {
//               console.error(`Error creating customer "${customerName}":`, error);
//               toast.error(`Error creating customer "${customerName}"`, {
//                 position: "top-right"
//               });
//             }
//           }

//            setInventoryData(inventoryResults);
//             toast.success("Excel file imported and data processed successfully!", {
//               position: "top-right"
//             });
//           } catch (error) {
//             console.error("Error processing data:", error);
//             toast.error("Error processing data. Please check console for details.", {
//               position: "top-right"
//             });
//           } finally {
//             setIsProcessing(false);
//           }
//         }
//       };
//       reader.readAsBinaryString(excelFile);
//     }
//   };


// const handleSubmitData = async () => {
//   console.log("Button is clicked");
//   console.log("User Id", customerID);
//   console.log("Product Id:", productID);
//   console.log("Product Price: ", productPrice[0]);
//   console.log("Date:", date[0]);
//   console.log("Customer Table ID", customerTableId);
//   console.log("Date:", date[0]);
//   console.log("Inventory Id ", inventoryID);
//   console.log("Product Quantity", quantity);
//   console.log("Excel Quantity ", excelquantity);

//   try {
//       // Generate random order number
//       const order_number = `ORD-${Date.now()}`;

//       // Format the date properly
//       let formattedDate;
//       if (date[0]) {
//           const dateObj = new Date(date[0]);
//           // Format as YYYY-MM-DD HH:MM:SS
//           formattedDate =
//               dateObj.getFullYear() + '-' +
//               String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
//               String(dateObj.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00'; 
//       } else {
//           const now = new Date();
//           formattedDate =
//               now.getFullYear() + '-' +
//               String(now.getMonth() + 1).padStart(2, '0') + '-' +
//               String(now.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00';
//       }

//       // Calculate due date (5 days from now)
//       const dueDateObj = new Date();
//       dueDateObj.setDate(dueDateObj.getDate() + 5);
//       const dueDate =
//           dueDateObj.getFullYear() + '-' +
//           String(dueDateObj.getMonth() + 1).padStart(2, '0') + '-' +
//           String(dueDateObj.getDate()).padStart(2, '0') + ' ' +
//           '00:00:00';

//       // Generate invoice number (format: INV-2025001)
//       const invoiceNumber = `INV-${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

//       // Prepare the order data
//       const orderData = {
//           order_number: order_number,
//           customer_id: customerTableId,
//           order_date: formattedDate,
//           status: "Pending",
//           total_amount: Number(productPrice[0]),
//           grand_total: Number(productPrice[0]),
//           payment_status: "Unpaid",
//           created_by: 1
//       };

//       console.log("Order data to be sent:", orderData);

//       const orderResponse = await fetch('http://localhost:8000/api/orders', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(orderData)
//       });

//       if (!orderResponse.ok) {
//           throw new Error(`HTTP error! status: ${orderResponse.status}`);
//       }

//       const orderResult = await orderResponse.json();
//       console.log("Order created successfully:", orderResult);

//       // Check quantity condition before creating order item
//       if (quantity < excelquantity) {
//           toast.error("Desired Quantity is Incorrect !!", {
//               position: "top-right"
//           });
//           return;
//       } else {
//           console.log("Quantity Ok");
//       }

//       const price_calcuation = (Number(productPrice[0]) * (excelquantity));

//       // Prepare order item data
//       const orderItemData = {
//           order_id: orderResult.id,
//           inventory_id: inventoryID,
//           quantity: excelquantity,
//           unit_price: price_calcuation,
//           total_price: price_calcuation
//       };

//       console.log("Order item data to be sent:", orderItemData);

//       // Make the POST request for order item
//       const orderItemResponse = await fetch('http://localhost:8000/api/order-items', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(orderItemData)
//       });

//       if (!orderItemResponse.ok) {
//           throw new Error(`HTTP error! status: ${orderItemResponse.status}`);
//       }

//       const orderItemResult = await orderItemResponse.json();
//       console.log("Order item created successfully:", orderItemResult);

//       // Prepare invoice data
//       const invoiceData = {
//           invoice_number: invoiceNumber,
//           order_id: orderResult.id,
//           customer_id: customerTableId,
//           invoice_date: formattedDate,
//           due_date: dueDate,
//           status: "Paid",
//           template_used: " ",
//           notes: " ",
//           created_by: 1
//       };

//       console.log("Invoice data to be sent:", invoiceData);

//       // Make the POST request for invoice
//       const invoiceResponse = await fetch('http://localhost:8000/api/invoices', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(invoiceData)
//       });

//       if (!invoiceResponse.ok) {
//           throw new Error(`HTTP error! status: ${invoiceResponse.status}`);
//       }

//       const invoiceResult = await invoiceResponse.json();
//       console.log("Invoice created successfully:", invoiceResult);

//       toast.success("Order, order item and invoice created successfully!", {
//           position: "top-right"
//       });

//   } catch (error) {
//       console.error("Error in order creation process:", error);
//       toast.error("Failed to complete order process. Please try again.", {
//           position: "top-right"
//       });
//   }
// };

//   return (
//     <React.Fragment>
//       <Row>
//         <Col>
//           <Card>
//             <CardBody>
//               {!showAddExcel ? (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Invoice Upload</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="success" onClick={handleShowExcelForm}>
//                       Upload Excel
//                     </Button>
//                   </Col>
//                 </Row>
//               ) : (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Import Excel File</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="secondary" onClick={handleBackToTable}>
//                       Back
//                     </Button>
//                   </Col>
//                 </Row>
//               )}

//               {showAddExcel && (
//                 <React.Fragment>
//                   <Row className="mb-3">
//                     <Col md={12}>
//                       <Input 
//                         type="file" 
//                         accept=".xlsx, .xls" 
//                         onChange={handleFileChange} 
//                       />
//                     </Col>
//                   </Row>
//                   <Row className="mb-3">
//                     <Col className="text-end">
//                       <Button color="primary" onClick={handleImportExcel}>
//                         Import
//                       </Button>
//                     </Col>
//                   </Row>
//                 </React.Fragment>
//               )}

//               {excelData.length > 0 && (
//                 <React.Fragment>
//                   <CardTitle className="h5">Imported Data</CardTitle>
//                   <div className="table-rep-plugin">
//                     <div className="table-responsive mb-0" data-pattern="priority-columns">
//                       <Table className="table table-striped table-bordered">
//                         <Thead>
//                           <Tr>
//                             {headers.map((header, index) => (
//                               <Th key={index}>{header}</Th>
//                             ))}
//                           </Tr>
//                         </Thead>
//                         <Tbody>
//                           {excelData.map((row, rowIndex) => (
//                             <Tr key={rowIndex}>
//                               {headers.map((header, cellIndex) => (
//                                 <Td key={cellIndex}>
//                                   {row[header] !== null && row[header] !== undefined && row[header] !== '' 
//                                     ? String(row[header]) 
//                                     : 'N/A'}
//                                 </Td>
//                               ))}
//                             </Tr>
//                           ))}
//                         </Tbody>
//                       </Table>
//                     </div>
//                   </div>
//                   <Row className="mt-3">
//                     <Col className="text-end">
//                       <Button 
//                         color="primary" 
//                         disabled={isProcessing}
//                         onClick={handleSubmitData}
//                       >
//                         {isProcessing ? 'Processing...' : 'Submit All Data'}
                        
//                       </Button>
//                     </Col>
//                   </Row>
//                 </React.Fragment>
//               )}

//               {showAddExcel && excelData.length === 0 && (
//                 <Row>
//                   <Col>
//                     <p>No data imported yet. Please choose an Excel file and click Import.</p>
//                   </Col>
//                 </Row>
//               )}
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//       <Toaster position="top-right" richColors />
//     </React.Fragment>
//   );
// };

// export default connect(null, { setBreadcrumbItems })(InvoiceUpload);


// ___________________________________ with console of multiple rows  _______________________________________________________________________


// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap";
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
// import { connect } from "react-redux";
// import { setBreadcrumbItems } from "../../store/actions";
// import * as XLSX from "xlsx";
// import { Toaster, toast } from "sonner";

// const InvoiceUpload = (props) => {
//   document.title = "Invoice Upload | Lexa - Responsive Bootstrap 5 Admin Dashboard";

//   const [showAddExcel, setShowAddExcel] = useState(false);
//   const [excelFile, setExcelFile] = useState(null);
//   const [excelData, setExcelData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processedData, setProcessedData] = useState([]);

//   const breadcrumbItems = [
//     { title: "Lexa", link: "#" },
//     { title: "Invoices", link: "#" },
//     { title: "Invoice Upload", link: "#" },
//   ];

//   useEffect(() => {
//     props.setBreadcrumbItems("Invoice Upload", breadcrumbItems);
//   }, []);

//   const handleShowExcelForm = () => {
//     setShowAddExcel(true);
//     setExcelFile(null);
//     setExcelData([]);
//     setProcessedData([]);
//   };

//   const handleBackToTable = () => {
//     setShowAddExcel(false);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setExcelFile(file);
//   };

//   // Function to fetch inventory data for a product model
//   const fetchInventoryData = async (model) => {
//     console.log(`Fetching inventory data for model: ${model}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/inventory?model_name=${model}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log(`Inventory data fetched for model ${model}:`, data);
//       return data;
//     } catch (error) {
//       console.error(`Error fetching inventory data for model ${model}:`, error);
//       return null;
//     }
//   };

//   const fetchCustomerData = async (cus_name, cus_email) => {
//     console.log(`Fetching customer data for: ${cus_name}, ${cus_email}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/users?name=${cus_name}&email=${cus_email}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Customer data fetched:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching customer data:", error);
//       return null;
//     }
//   };

//   const fetchCustomerIDFromTable = async (cus_id) => {
//     console.log(`Fetching customer ID from table for user ID: ${cus_id}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/customers?user_id=${cus_id}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Customer table data fetched:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching customer ID from table:", error);
//       return null;
//     }
//   };

//   const handleImportExcel = () => {
//     if (excelFile) {
//       const reader = new FileReader();
//       reader.onload = async (evt) => {
//         const binaryStr = evt.target.result;
//         const wb = XLSX.read(binaryStr, { type: "binary", cellDates: true });
//         const wsname = wb.SheetNames[0];
//         const ws = wb.Sheets[wsname];
//         const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
//         if (data.length > 0) {
//           const excelHeaders = data[0].map(header => header.trim());
//           setHeaders(excelHeaders);
          
//           const formattedData = data.slice(1).map(row => {
//             let obj = {};
//             excelHeaders.forEach((header, index) => {
//               obj[header] = row[index] !== undefined ? row[index] : '';
//             });
//             return obj;
//           });
          
//           setExcelData(formattedData);
//           console.log("Formatted data:", formattedData);
//           processExcelData(formattedData);
//         }
//       };
//       reader.readAsBinaryString(excelFile);
//     }
//   };

//   const processExcelData = async (formattedData) => {
//     try {
//       setIsProcessing(true);
//       const processedRows = [];
      
//       // Process each row individually
//       for (const row of formattedData) {
//         try {
//           const productModel = row.product_model;
//           const productName = row.product_name;
//           const excelquantity = row.quantity;
//           const productPrice = row.product_price;
//           const customer = row.customer_name;
//           const cusEmail = row.customer_email;
//           const color = row.color;
//           const date = row.date;

//           console.log(`Processing product: ${productName}, model: ${productModel}`);
//           console.log(`Customer: ${customer}, email: ${cusEmail}`);
//           console.log(`Quantity: ${excelquantity}, Price: ${productPrice}`);

//           // Process brand
//           let existingBrandID;
//           const searchResponse = await fetch(`http://localhost:8000/api/brands/search?query=${productName}`);
//           const searchData = await searchResponse.json();
          
//           if (searchData && searchData.data && searchData.data.length > 0) {
//             existingBrandID = searchData.data[0].id;
//             console.log(`Existing brand found with ID: ${existingBrandID}`);
//           } else {
//             console.log(`Brand not found, creating new brand: ${productName}`);
//             // Brand doesn't exist - create it
//             const createResponse = await fetch('http://localhost:8000/api/brands', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 brand_name: productName,
//               }),
//             });
            
//             if (!createResponse.ok) {
//               throw new Error(`Failed to create brand: ${createResponse.status}`);
//             }
            
//             const createdBrand = await createResponse.json();
//             existingBrandID = createdBrand.data.id;
//             console.log(`New brand created with ID: ${existingBrandID}`);
//           }

//           // Process inventory
//           console.log(`Fetching inventory for model: ${productModel}`);
//           const inventoryData = await fetchInventoryData(productModel);
//           let inventoryInfo = {};
          
//           if (inventoryData && inventoryData.data && inventoryData.data.data && inventoryData.data.data.length > 0) {
//             console.log("Inventory data found:", inventoryData.data.data[0]);
//             inventoryInfo = {
//               inventoryID: inventoryData.data.data[0].id,
//               productID: inventoryData.data.data[0].variant.product.id,
//               sku: inventoryData.data.data[0].variant.product.sku,
//               stockStatus: inventoryData.data.data[0].stock_status,
//               color: inventoryData.data.data[0].variant.color,
//               storageGb: inventoryData.data.data[0].variant.storage_gb,
//               quantity: inventoryData.data.data[0].variant.product.quantity,
//               image: inventoryData.data.data[0].variant.product.feature_imageUrl
//             };
//             console.log("Inventory info prepared:", inventoryInfo);
//           } else {
//             throw new Error(`Inventory data not found for model ${productModel}`);
//           }

//           // Process customer
//           const CustomerData = await fetchCustomerData(customer, cusEmail);
//           let customerInfo = {};
          
//           if (CustomerData && CustomerData.data && CustomerData.data.length > 0) {
//             console.log("Existing customer found:", CustomerData.data[0]);
//             const existingCustomerID = CustomerData.data[0].id;
//             console.log(`Fetching customer table entry for user ID: ${existingCustomerID}`);
//             const CustomerIDFinder = await fetchCustomerIDFromTable(existingCustomerID);
            
//             if (CustomerIDFinder && CustomerIDFinder.data && CustomerIDFinder.data.data && CustomerIDFinder.data.data.length > 0) {
//               console.log("Customer table entry found:", CustomerIDFinder.data.data[0]);
//               customerInfo = {
//                 customerID: existingCustomerID,
//                 customerTableId: CustomerIDFinder.data.data[0].id
//               };
//               console.log("Customer info prepared:", customerInfo);
//             } else {
//               throw new Error(`Customer table entry not found for user ${existingCustomerID}`);
//             }
//           } else {
//             console.log("Customer not found, creating new customer");
//             // Create new customer
//             const createResponse = await fetch('http://localhost:8000/api/users', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 name: customer,
//                 email: cusEmail,
//                 password: "customer123",
//                 role: "customer"
//               }),
//             });
            
//             if (!createResponse.ok) {
//               throw new Error(`Failed to create customer: ${createResponse.status}`);
//             }
            
//             const createdCustomer = await createResponse.json();
//             const newCustomerId = createdCustomer.user.id;
//             console.log(`New user created with ID: ${newCustomerId}`);
            
//             // Create customer in customers table
//             console.log("Creating customer in customers table");
//             const customerPostResponse = await fetch('http://localhost:8000/api/customers', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 user_id: newCustomerId,
//                 customer_type: "Retail"
//               }),
//             });
            
//             if (!customerPostResponse.ok) {
//               throw new Error(`Failed to add customer to customers table: ${customerPostResponse.status}`);
//             }
            
//             const customerData = await customerPostResponse.json();
//             console.log("New customer created in customers table:", customerData);
//             customerInfo = {
//               customerID: newCustomerId,
//               customerTableId: customerData.id
//             };
//             console.log("New customer info prepared:", customerInfo);
//           }

//           processedRows.push({
//             ...row,
//             inventoryInfo,
//             customerInfo,
//             brandID: existingBrandID,
//             status: 'Processed'
//           });
          
//         } catch (error) {
//           processedRows.push({
//             ...row,
//             status: 'Error',
//             error: error.message
//           });
//         }
//       }
      
//       setProcessedData(processedRows);
//       console.log("All rows processed:", processedRows);
//       toast.success("Excel file processed successfully!", {
//         position: "top-right"
//       });
      
//     } catch (error) {
//       console.error("Error processing data:", error);
//       toast.error("Error processing data. Please check console for details.", {
//         position: "top-right"
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSubmitData = async () => {
//     try {
//       setIsProcessing(true);
//       const results = [];
      
//       for (const row of processedData) {
//         try {
//           if (row.status !== 'Processed') {
//             console.log("Skipping row with status:", row.status);
//             results.push({
//               ...row,
//               orderStatus: 'Skipped',
//               orderItemStatus: 'Skipped',
//               invoiceStatus: 'Skipped'
//             });
//             continue;
//           }

//           // Generate random order number
//           const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//           // Format the date properly
//           let formattedDate;
//           if (row.date) {
//             const dateObj = new Date(row.date);
//             formattedDate =
//               dateObj.getFullYear() + '-' +
//               String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
//               String(dateObj.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00'; 
//           } else {
//             const now = new Date();
//             formattedDate =
//               now.getFullYear() + '-' +
//               String(now.getMonth() + 1).padStart(2, '0') + '-' +
//               String(now.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00';
//           }

//           // Calculate due date (5 days from now)
//           const dueDateObj = new Date();
//           dueDateObj.setDate(dueDateObj.getDate() + 5);
//           const dueDate =
//             dueDateObj.getFullYear() + '-' +
//             String(dueDateObj.getMonth() + 1).padStart(2, '0') + '-' +
//             String(dueDateObj.getDate()).padStart(2, '0') + ' ' +
//             '00:00:00';

//           // Generate invoice number
//           const invoiceNumber = `INV-${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

//           // Check quantity condition
//           if (row.inventoryInfo.quantity < row.quantity) {
//             console.log(`Insufficient quantity: Available ${row.inventoryInfo.quantity}, requested ${row.quantity}`);
//             results.push({
//               ...row,
//               orderStatus: 'Failed',
//               orderItemStatus: 'Failed',
//               invoiceStatus: 'Failed',
//               error: 'Insufficient quantity'
//             });
//             continue;
//           }

//           // Create order
//           const orderData = {
//             order_number: order_number,
//             customer_id: row.customerInfo.customerTableId,
//             order_date: formattedDate,
//             status: "Pending",
//             total_amount: Number(row.product_price),
//             grand_total: Number(row.product_price),
//             payment_status: "Unpaid",
//             created_by: 1
//           };
//           console.log("Order data to create:", orderData);

//           const orderResponse = await fetch('http://localhost:8000/api/orders', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderData)
//           });

//           if (!orderResponse.ok) {
//             throw new Error(`Failed to create order: ${orderResponse.status}`);
//           }

//           const orderResult = await orderResponse.json();
//           console.log("Order created successfully:", orderResult);

//           // Create order item
//           const price_calcuation = (Number(row.product_price) * (row.quantity));
//           const orderItemData = {
//             order_id: orderResult.id,
//             inventory_id: row.inventoryInfo.inventoryID,
//             quantity: row.quantity,
//             unit_price: price_calcuation,
//             total_price: price_calcuation
//           };
//           console.log("Order item data to create:", orderItemData);

//           const orderItemResponse = await fetch('http://localhost:8000/api/order-items', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderItemData)
//           });

//           if (!orderItemResponse.ok) {
//             throw new Error(`Failed to create order item: ${orderItemResponse.status}`);
//           }

//           const orderItemResult = await orderItemResponse.json();
//           console.log("Order item created successfully:", orderItemResult);

//           // Create invoice
//           const invoiceData = {
//             invoice_number: invoiceNumber,
//             order_id: orderResult.id,
//             customer_id: row.customerInfo.customerTableId,
//             invoice_date: formattedDate,
//             due_date: dueDate,
//             status: "Paid",
//             template_used: " ",
//             notes: " ",
//             created_by: 1
//           };
//           console.log("Invoice data to create:", invoiceData);

//           const invoiceResponse = await fetch('http://localhost:8000/api/invoices', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(invoiceData)
//           });

//           if (!invoiceResponse.ok) {
//             throw new Error(`Failed to create invoice: ${invoiceResponse.status}`);
//           }

//           const invoiceResult = await invoiceResponse.json();
//           console.log("Invoice created successfully:", invoiceResult);

//           results.push({
//             ...row,
//             orderStatus: 'Created',
//             orderItemStatus: 'Created',
//             invoiceStatus: 'Created',
//             orderNumber: order_number,
//             invoiceNumber: invoiceNumber
//           });
//           console.log("Row submitted successfully");

//         } catch (error) {
//           console.error(`Error processing row ${row.customer_name}:`, error);
//           results.push({
//             ...row,
//             orderStatus: 'Failed',
//             orderItemStatus: 'Failed',
//             invoiceStatus: 'Failed',
//             error: error.message
//           });
//         }
//       }

//       setProcessedData(results);
//       console.log("All rows submission results:", results);
      
//       // Count successes and failures
//       const successCount = results.filter(r => r.orderStatus === 'Created').length;
//       const errorCount = results.filter(r => r.orderStatus === 'Failed').length;
      
//       if (errorCount === 0) {
//         toast.success(`All ${successCount} records processed successfully!`, {
//           position: "top-right"
//         });
//       } else if (successCount === 0) {
//         toast.error(`All ${errorCount} records failed to process.`, {
//           position: "top-right"
//         });
//       } else {
//         toast.warning(`${successCount} records succeeded, ${errorCount} records failed.`, {
//           position: "top-right"
//         });
//       }
      
//     } catch (error) {
//       console.error("Error in bulk submission:", error);
//       toast.error("Failed to complete bulk submission. Please try again.", {
//         position: "top-right"
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <React.Fragment>
//       <Row>
//         <Col>
//           <Card>
//             <CardBody>
//               {!showAddExcel ? (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Invoice Upload</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="success" onClick={handleShowExcelForm}>
//                       Upload Excel
//                     </Button>
//                   </Col>
//                 </Row>
//               ) : (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Import Excel File</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="secondary" onClick={handleBackToTable}>
//                       Back
//                     </Button>
//                   </Col>
//                 </Row>
//               )}

//               {showAddExcel && (
//                 <React.Fragment>
//                   <Row className="mb-3">
//                     <Col md={12}>
//                       <Input 
//                         type="file" 
//                         accept=".xlsx, .xls" 
//                         onChange={handleFileChange} 
//                       />
//                     </Col>
//                   </Row>
//                   <Row className="mb-3">
//                     <Col className="text-end">
//                       <Button color="primary" onClick={handleImportExcel} disabled={isProcessing}>
//                         {isProcessing ? 'Processing...' : 'Import'}
//                       </Button>
//                     </Col>
//                   </Row>
//                 </React.Fragment>
//               )}

//               {(excelData.length > 0 || processedData.length > 0) && (
//                 <React.Fragment>
//                   <CardTitle className="h5">Imported Data</CardTitle>
//                   <div className="table-rep-plugin">
//                     <div className="table-responsive mb-0" data-pattern="priority-columns">
//                       <Table className="table table-striped table-bordered">
//                         <Thead>
//                           <Tr>
//                             {headers.map((header, index) => (
//                               <Th key={index}>{header}</Th>
//                             ))}
//                             {processedData.length > 0 && (
//                               <>
//                                 <Th>Status</Th>
//                                 <Th>Order #</Th>
//                                 <Th>Invoice #</Th>
//                               </>
//                             )}
//                           </Tr>
//                         </Thead>
//                         <Tbody>
//                           {(processedData.length > 0 ? processedData : excelData).map((row, rowIndex) => (
//                             <Tr key={rowIndex}>
//                               {headers.map((header, cellIndex) => (
//                                 <Td key={cellIndex}>
//                                   {row[header] !== null && row[header] !== undefined && row[header] !== '' 
//                                     ? String(row[header]) 
//                                     : 'N/A'}
//                                 </Td>
//                               ))}
//                               {processedData.length > 0 && (
//                                 <>
//                                   <Td>
//                                     {row.status === 'Processed' ? 'Ready' : 
//                                      row.status === 'Error' ? 'Error' : 
//                                      row.orderStatus === 'Created' ? 'Completed' : 
//                                      row.orderStatus === 'Failed' ? 'Failed' : 'Pending'}
//                                   </Td>
//                                   <Td>{row.orderNumber || 'N/A'}</Td>
//                                   <Td>{row.invoiceNumber || 'N/A'}</Td>
//                                 </>
//                               )}
//                             </Tr>
//                           ))}
//                         </Tbody>
//                       </Table>
//                     </div>
//                   </div>
//                   {processedData.length > 0 && (
//                     <Row className="mt-3">
//                       <Col className="text-end">
//                         <Button 
//                           color="primary" 
//                           disabled={isProcessing || processedData.some(row => row.status !== 'Processed')}
//                           onClick={handleSubmitData}
//                         >
//                           {isProcessing ? 'Processing...' : 'Submit All Data'}
//                         </Button>
//                       </Col>
//                     </Row>
//                   )}
//                 </React.Fragment>
//               )}

//               {showAddExcel && excelData.length === 0 && processedData.length === 0 && (
//                 <Row>
//                   <Col>
//                     <p>No data imported yet. Please choose an Excel file and click Import.</p>
//                   </Col>
//                 </Row>
//               )}
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//       <Toaster position="top-right" richColors />
//     </React.Fragment>
//   );
// };

// export default connect(null, { setBreadcrumbItems })(InvoiceUpload);


// _________________________________________________ delete button functionalit ___________________________________________

// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap";
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
// import { connect } from "react-redux";
// import { setBreadcrumbItems } from "../../store/actions";
// import * as XLSX from "xlsx";
// import { Toaster, toast } from "sonner";

// const InvoiceUpload = (props) => {
//   document.title = "Invoice Upload | Lexa - Responsive Bootstrap 5 Admin Dashboard";

//   const [showAddExcel, setShowAddExcel] = useState(false);
//   const [excelFile, setExcelFile] = useState(null);
//   const [excelData, setExcelData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processedData, setProcessedData] = useState([]);

//   const breadcrumbItems = [
//     { title: "Lexa", link: "#" },
//     { title: "Invoices", link: "#" },
//     { title: "Invoice Upload", link: "#" },
//   ];

//   useEffect(() => {
//     props.setBreadcrumbItems("Invoice Upload", breadcrumbItems);
//   }, []);

//   const handleShowExcelForm = () => {
//     setShowAddExcel(true);
//     setExcelFile(null);
//     setExcelData([]);
//     setProcessedData([]);
//   };

//   const handleBackToTable = () => {
//     setShowAddExcel(false);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setExcelFile(file);
//   };

//   // Function to delete a row from the data
//   const handleDeleteRow = (rowIndex) => {
//     if (processedData.length > 0) {
//       const newData = [...processedData];
//       newData.splice(rowIndex, 1);
//       setProcessedData(newData);
//     } else {
//       const newData = [...excelData];
//       newData.splice(rowIndex, 1);
//       setExcelData(newData);
//     }
//     toast.success("Row deleted successfully!");
//   };

//   // Function to fetch inventory data for a product model
//   const fetchInventoryData = async (model) => {
//     console.log(`Fetching inventory data for model: ${model}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/inventory?model_name=${model}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log(`Inventory data fetched for model ${model}:`, data);
//       return data;
//     } catch (error) {
//       console.error(`Error fetching inventory data for model ${model}:`, error);
//       return null;
//     }
//   };

//   const fetchCustomerData = async (cus_name, cus_email) => {
//     console.log(`Fetching customer data for: ${cus_name}, ${cus_email}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/users?name=${cus_name}&email=${cus_email}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Customer data fetched:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching customer data:", error);
//       return null;
//     }
//   };

//   const fetchCustomerIDFromTable = async (cus_id) => {
//     console.log(`Fetching customer ID from table for user ID: ${cus_id}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/customers?user_id=${cus_id}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Customer table data fetched:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching customer ID from table:", error);
//       return null;
//     }
//   };

//   const handleImportExcel = () => {
//     if (excelFile) {
//       const reader = new FileReader();
//       reader.onload = async (evt) => {
//         const binaryStr = evt.target.result;
//         const wb = XLSX.read(binaryStr, { type: "binary", cellDates: true });
//         const wsname = wb.SheetNames[0];
//         const ws = wb.Sheets[wsname];
//         const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
//         if (data.length > 0) {
//           const excelHeaders = data[0].map(header => header.trim());
//           setHeaders(excelHeaders);
          
//           const formattedData = data.slice(1).map(row => {
//             let obj = {};
//             excelHeaders.forEach((header, index) => {
//               obj[header] = row[index] !== undefined ? row[index] : '';
//             });
//             return obj;
//           });
          
//           setExcelData(formattedData);
//           console.log("Formatted data:", formattedData);
//           processExcelData(formattedData);
//         }
//       };
//       reader.readAsBinaryString(excelFile);
//     }
//   };

//   const processExcelData = async (formattedData) => {
//     try {
//       setIsProcessing(true);
//       const processedRows = [];
      
//       // Process each row individually
//       for (const row of formattedData) {
//         try {
//           const productModel = row.product_model;
//           const productName = row.product_name;
//           const excelquantity = row.quantity;
//           const productPrice = row.product_price;
//           const customer = row.customer_name;
//           const cusEmail = row.customer_email;
//           const color = row.color;
//           const date = row.date;

//           console.log(`Processing product: ${productName}, model: ${productModel}`);
//           console.log(`Customer: ${customer}, email: ${cusEmail}`);
//           console.log(`Quantity: ${excelquantity}, Price: ${productPrice}`);

//           // Process brand
//           let existingBrandID;
//           const searchResponse = await fetch(`http://localhost:8000/api/brands/search?query=${productName}`);
//           const searchData = await searchResponse.json();
          
//           if (searchData && searchData.data && searchData.data.length > 0) {
//             existingBrandID = searchData.data[0].id;
//             console.log(`Existing brand found with ID: ${existingBrandID}`);
//           } else {
//             console.log(`Brand not found, creating new brand: ${productName}`);
//             // Brand doesn't exist - create it
//             const createResponse = await fetch('http://localhost:8000/api/brands', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 brand_name: productName,
//               }),
//             });
            
//             if (!createResponse.ok) {
//               throw new Error(`Failed to create brand: ${createResponse.status}`);
//             }
            
//             const createdBrand = await createResponse.json();
//             existingBrandID = createdBrand.data.id;
//             console.log(`New brand created with ID: ${existingBrandID}`);
//           }

//           // Process inventory
//           console.log(`Fetching inventory for model: ${productModel}`);
//           const inventoryData = await fetchInventoryData(productModel);
//           let inventoryInfo = {};
          
//           if (inventoryData && inventoryData.data && inventoryData.data.data && inventoryData.data.data.length > 0) {
//             console.log("Inventory data found:", inventoryData.data.data[0]);
//             inventoryInfo = {
//               inventoryID: inventoryData.data.data[0].id,
//               productID: inventoryData.data.data[0].variant.product.id,
//               sku: inventoryData.data.data[0].variant.product.sku,
//               stockStatus: inventoryData.data.data[0].stock_status,
//               color: inventoryData.data.data[0].variant.color,
//               storageGb: inventoryData.data.data[0].variant.storage_gb,
//               quantity: inventoryData.data.data[0].variant.product.quantity,
//               image: inventoryData.data.data[0].variant.product.feature_imageUrl
//             };
//             console.log("Inventory info prepared:", inventoryInfo);
//           } else {
//             throw new Error(`Inventory data not found for model ${productModel}`);
//           }

//           // Process customer
//           const CustomerData = await fetchCustomerData(customer, cusEmail);
//           let customerInfo = {};
          
//           if (CustomerData && CustomerData.data && CustomerData.data.length > 0) {
//             console.log("Existing customer found:", CustomerData.data[0]);
//             const existingCustomerID = CustomerData.data[0].id;
//             console.log(`Fetching customer table entry for user ID: ${existingCustomerID}`);
//             const CustomerIDFinder = await fetchCustomerIDFromTable(existingCustomerID);
            
//             if (CustomerIDFinder && CustomerIDFinder.data && CustomerIDFinder.data.data && CustomerIDFinder.data.data.length > 0) {
//               console.log("Customer table entry found:", CustomerIDFinder.data.data[0]);
//               customerInfo = {
//                 customerID: existingCustomerID,
//                 customerTableId: CustomerIDFinder.data.data[0].id
//               };
//               console.log("Customer info prepared:", customerInfo);
//             } else {
//               throw new Error(`Customer table entry not found for user ${existingCustomerID}`);
//             }
//           } else {
//             console.log("Customer not found, creating new customer");
//             // Create new customer
//             const createResponse = await fetch('http://localhost:8000/api/users', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 name: customer,
//                 email: cusEmail,
//                 password: "customer123",
//                 role: "customer"
//               }),
//             });
            
//             if (!createResponse.ok) {
//               throw new Error(`Failed to create customer: ${createResponse.status}`);
//             }
            
//             const createdCustomer = await createResponse.json();
//             const newCustomerId = createdCustomer.user.id;
//             console.log(`New user created with ID: ${newCustomerId}`);
            
//             // Create customer in customers table
//             console.log("Creating customer in customers table");
//             const customerPostResponse = await fetch('http://localhost:8000/api/customers', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 user_id: newCustomerId,
//                 customer_type: "Retail"
//               }),
//             });
            
//             if (!customerPostResponse.ok) {
//               throw new Error(`Failed to add customer to customers table: ${customerPostResponse.status}`);
//             }
            
//             const customerData = await customerPostResponse.json();
//             console.log("New customer created in customers table:", customerData);
//             customerInfo = {
//               customerID: newCustomerId,
//               customerTableId: customerData.id
//             };
//             console.log("New customer info prepared:", customerInfo);
//           }

//           processedRows.push({
//             ...row,
//             inventoryInfo,
//             customerInfo,
//             brandID: existingBrandID,
//             status: 'Processed'
//           });
          
//         } catch (error) {
//           processedRows.push({
//             ...row,
//             status: 'Error',
//             error: error.message
//           });
//         }
//       }
      
//       setProcessedData(processedRows);
//       console.log("All rows processed:", processedRows);
//       toast.success("Excel file processed successfully!", {
//         position: "top-right"
//       });
      
//     } catch (error) {
//       console.error("Error processing data:", error);
//       toast.error("Error processing data. Please check console for details.", {
//         position: "top-right"
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSubmitData = async () => {
//     try {
//       setIsProcessing(true);
//       const results = [];
      
//       for (const row of processedData) {
//         try {
//           if (row.status !== 'Processed') {
//             console.log("Skipping row with status:", row.status);
//             results.push({
//               ...row,
//               orderStatus: 'Skipped',
//               orderItemStatus: 'Skipped',
//               invoiceStatus: 'Skipped'
//             });
//             continue;
//           }

//           // Generate random order number
//           const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//           // Format the date properly
//           let formattedDate;
//           if (row.date) {
//             const dateObj = new Date(row.date);
//             formattedDate =
//               dateObj.getFullYear() + '-' +
//               String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
//               String(dateObj.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00'; 
//           } else {
//             const now = new Date();
//             formattedDate =
//               now.getFullYear() + '-' +
//               String(now.getMonth() + 1).padStart(2, '0') + '-' +
//               String(now.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00';
//           }

//           // Calculate due date (5 days from now)
//           const dueDateObj = new Date();
//           dueDateObj.setDate(dueDateObj.getDate() + 5);
//           const dueDate =
//             dueDateObj.getFullYear() + '-' +
//             String(dueDateObj.getMonth() + 1).padStart(2, '0') + '-' +
//             String(dueDateObj.getDate()).padStart(2, '0') + ' ' +
//             '00:00:00';

//           // Generate invoice number
//           const invoiceNumber = `INV-${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

//           // Check quantity condition
//           if (row.inventoryInfo.quantity < row.quantity) {
//             console.log(`Insufficient quantity: Available ${row.inventoryInfo.quantity}, requested ${row.quantity}`);
//             results.push({
//               ...row,
//               orderStatus: 'Failed',
//               orderItemStatus: 'Failed',
//               invoiceStatus: 'Failed',
//               error: 'Insufficient quantity'
//             });
//             continue;
//           }

//           // Create order
//           const orderData = {
//             order_number: order_number,
//             customer_id: row.customerInfo.customerTableId,
//             order_date: formattedDate,
//             status: "Pending",
//             total_amount: Number(row.product_price),
//             grand_total: Number(row.product_price),
//             payment_status: "Unpaid",
//             created_by: 1
//           };
//           console.log("Order data to create:", orderData);

//           const orderResponse = await fetch('http://localhost:8000/api/orders', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderData)
//           });

//           if (!orderResponse.ok) {
//             throw new Error(`Failed to create order: ${orderResponse.status}`);
//           }

//           const orderResult = await orderResponse.json();
//           console.log("Order created successfully:", orderResult);

//           // Create order item
//           const price_calcuation = (Number(row.product_price) * (row.quantity));
//           const orderItemData = {
//             order_id: orderResult.id,
//             inventory_id: row.inventoryInfo.inventoryID,
//             quantity: row.quantity,
//             unit_price: price_calcuation,
//             total_price: price_calcuation
//           };
//           console.log("Order item data to create:", orderItemData);

//           const orderItemResponse = await fetch('http://localhost:8000/api/order-items', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderItemData)
//           });

//           if (!orderItemResponse.ok) {
//             throw new Error(`Failed to create order item: ${orderItemResponse.status}`);
//           }

//           const orderItemResult = await orderItemResponse.json();
//           console.log("Order item created successfully:", orderItemResult);

//           // Create invoice
//           const invoiceData = {
//             invoice_number: invoiceNumber,
//             order_id: orderResult.id,
//             customer_id: row.customerInfo.customerTableId,
//             invoice_date: formattedDate,
//             due_date: dueDate,
//             status: "Paid",
//             template_used: " ",
//             notes: " ",
//             created_by: 1
//           };
//           console.log("Invoice data to create:", invoiceData);

//           const invoiceResponse = await fetch('http://localhost:8000/api/invoices', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(invoiceData)
//           });

//           if (!invoiceResponse.ok) {
//             throw new Error(`Failed to create invoice: ${invoiceResponse.status}`);
//           }

//           const invoiceResult = await invoiceResponse.json();
//           console.log("Invoice created successfully:", invoiceResult);

//           results.push({
//             ...row,
//             orderStatus: 'Created',
//             orderItemStatus: 'Created',
//             invoiceStatus: 'Created',
//             orderNumber: order_number,
//             invoiceNumber: invoiceNumber
//           });
//           console.log("Row submitted successfully");

//         } catch (error) {
//           console.error(`Error processing row ${row.customer_name}:`, error);
//           results.push({
//             ...row,
//             orderStatus: 'Failed',
//             orderItemStatus: 'Failed',
//             invoiceStatus: 'Failed',
//             error: error.message
//           });
//         }
//       }

//       setProcessedData(results);
//       console.log("All rows submission results:", results);
      
//       // Count successes and failures
//       const successCount = results.filter(r => r.orderStatus === 'Created').length;
//       const errorCount = results.filter(r => r.orderStatus === 'Failed').length;
      
//       if (errorCount === 0) {
//         toast.success(`All ${successCount} records processed successfully!`, {
//           position: "top-right"
//         });
//       } else if (successCount === 0) {
//         toast.error(`All ${errorCount} records failed to process.`, {
//           position: "top-right"
//         });
//       } else {
//         toast.warning(`${successCount} records succeeded, ${errorCount} records failed.`, {
//           position: "top-right"
//         });
//       }
      
//     } catch (error) {
//       console.error("Error in bulk submission:", error);
//       toast.error("Failed to complete bulk submission. Please try again.", {
//         position: "top-right"
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <React.Fragment>
//       <Row>
//         <Col>
//           <Card>
//             <CardBody>
//               {!showAddExcel ? (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Invoice Upload</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="success" onClick={handleShowExcelForm}>
//                       Upload Excel
//                     </Button>
//                   </Col>
//                 </Row>
//               ) : (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Import Excel File</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="secondary" onClick={handleBackToTable}>
//                       Back
//                     </Button>
//                   </Col>
//                 </Row>
//               )}

//               {showAddExcel && (
//                 <React.Fragment>
//                   <Row className="mb-3">
//                     <Col md={12}>
//                       <Input 
//                         type="file" 
//                         accept=".xlsx, .xls" 
//                         onChange={handleFileChange} 
//                       />
//                     </Col>
//                   </Row>
//                   <Row className="mb-3">
//                     <Col className="text-end">
//                       <Button color="primary" onClick={handleImportExcel} disabled={isProcessing}>
//                         {isProcessing ? 'Processing...' : 'Import'}
//                       </Button>
//                     </Col>
//                   </Row>
//                 </React.Fragment>
//               )}

//               {(excelData.length > 0 || processedData.length > 0) && (
//                 <React.Fragment>
//                   <CardTitle className="h5">Imported Data</CardTitle>
//                   <div className="table-rep-plugin">
//                     <div className="table-responsive mb-0" data-pattern="priority-columns">
//                       <Table className="table table-striped table-bordered">
//                         <Thead>
//                           <Tr>
//                             {headers.map((header, index) => (
//                               <Th key={index}>{header}</Th>
//                             ))}
//                             <Th>Action</Th>
//                           </Tr>
//                         </Thead>
//                         <Tbody>
//                           {(processedData.length > 0 ? processedData : excelData).map((row, rowIndex) => (
//                             <Tr key={rowIndex}>
//                               {headers.map((header, cellIndex) => (
//                                 <Td key={cellIndex}>
//                                   {row[header] !== null && row[header] !== undefined && row[header] !== '' 
//                                     ? String(row[header]) 
//                                     : 'N/A'}
//                                 </Td>
//                               ))}
//                               <Td>
//                                 <Button 
//                                   color="danger" 
//                                   size="sm" 
//                                   onClick={() => handleDeleteRow(rowIndex)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </Td>
//                             </Tr>
//                           ))}
//                         </Tbody>
//                       </Table>
//                     </div>
//                   </div>
//                   {processedData.length > 0 && (
//                     <Row className="mt-3">
//                       <Col className="text-end">
//                         <Button 
//                           color="primary" 
//                           disabled={isProcessing || processedData.some(row => row.status !== 'Processed')}
//                           onClick={handleSubmitData}
//                         >
//                           {isProcessing ? 'Processing...' : 'Submit All Data'}
//                         </Button>
//                       </Col>
//                     </Row>
//                   )}
//                 </React.Fragment>
//               )}

//               {showAddExcel && excelData.length === 0 && processedData.length === 0 && (
//                 <Row>
//                   <Col>
//                     <p>No data imported yet. Please choose an Excel file and click Import.</p>
//                   </Col>
//                 </Row>
//               )}
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//       <Toaster position="top-right" richColors />
//     </React.Fragment>
//   );
// };

// export default connect(null, { setBreadcrumbItems })(InvoiceUpload);


// ____________________________________________________________ serial number condition _____________________________________

// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap";
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
// import { connect } from "react-redux";
// import { setBreadcrumbItems } from "../../store/actions";
// import * as XLSX from "xlsx";
// import { Toaster, toast } from "sonner";

// const InvoiceUpload = (props) => {
//   document.title = "Invoice Upload | Lexa - Responsive Bootstrap 5 Admin Dashboard";

//   const [showAddExcel, setShowAddExcel] = useState(false);
//   const [excelFile, setExcelFile] = useState(null);
//   const [excelData, setExcelData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processedData, setProcessedData] = useState([]);

//   const breadcrumbItems = [
//     { title: "Lexa", link: "#" },
//     { title: "Invoices", link: "#" },
//     { title: "Invoice Upload", link: "#" },
//   ];

//   useEffect(() => {
//     props.setBreadcrumbItems("Invoice Upload", breadcrumbItems);
//   }, []);

//   const handleShowExcelForm = () => {
//     setShowAddExcel(true);
//     setExcelFile(null);
//     setExcelData([]);
//     setProcessedData([]);
//   };

//   const handleBackToTable = () => {
//     setShowAddExcel(false);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setExcelFile(file);
//   };

//   const handleDeleteRow = (rowIndex) => {
//     if (processedData.length > 0) {
//       const newData = [...processedData];
//       newData.splice(rowIndex, 1);
//       setProcessedData(newData);
//     } else {
//       const newData = [...excelData];
//       newData.splice(rowIndex, 1);
//       setExcelData(newData);
//     }
//     toast.success("Row deleted successfully!");
//   };

//   const fetchInventoryData = async (model) => {
//     console.log(`Fetching inventory data for model: ${model}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/inventory?model_name=${model}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log(`Inventory data fetched for model ${model}:`, data);
//       return data;
//     } catch (error) {
//       console.error(`Error fetching inventory data for model ${model}:`, error);
//       return null;
//     }
//   };

//   const fetchCustomerData = async (cus_name, cus_email) => {
//     console.log(`Fetching customer data for: ${cus_name}, ${cus_email}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/users?name=${cus_name}&email=${cus_email}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Customer data fetched:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching customer data:", error);
//       return null;
//     }
//   };

//   const fetchCustomerIDFromTable = async (cus_id) => {
//     console.log(`Fetching customer ID from table for user ID: ${cus_id}`);
//     try {
//       const response = await fetch(`http://localhost:8000/api/customers?user_id=${cus_id}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Customer table data fetched:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching customer ID from table:", error);
//       return null;
//     }
//   };

//   const handleImportExcel = () => {
//     if (excelFile) {
//       const reader = new FileReader();
//       reader.onload = async (evt) => {
//         const binaryStr = evt.target.result;
//         const wb = XLSX.read(binaryStr, { type: "binary", cellDates: true });
//         const wsname = wb.SheetNames[0];
//         const ws = wb.Sheets[wsname];
//         const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
//         if (data.length > 0) {
//           const excelHeaders = data[0].map(header => header.trim());
//           setHeaders(excelHeaders);
          
//           const formattedData = data.slice(1).map(row => {
//             let obj = {};
//             excelHeaders.forEach((header, index) => {
//               obj[header] = row[index] !== undefined ? row[index] : '';
//             });
//             return obj;
//           });
          
//           setExcelData(formattedData);
//           console.log("Formatted data:", formattedData);
//           processExcelData(formattedData);
//         }
//       };
//       reader.readAsBinaryString(excelFile);
//     }
//   };

//   const processExcelData = async (formattedData) => {
//     try {
//       setIsProcessing(true);
//       const processedRows = [];
      
//       // Process each row individually
//       for (const row of formattedData) {
//         try {
//           const productModel = row.product_model;
//           const productName = row.product_name;
//           const excelquantity = row.quantity;
//           const productPrice = row.product_price;
//           const customer = row.customer_name;
//           const cusEmail = row.customer_email;
//           const color = row.color;
//           const date = row.date;
//           const number = row.user_number;

//           console.log(`Processing product: ${productName}, model: ${productModel}`);
//           console.log(`Customer: ${customer}, email: ${cusEmail}`);
//           console.log(`Quantity: ${excelquantity}, Price: ${productPrice}`);
//           console.log(`Color: ${color}, Date: ${date}, Serial Number: ${number}`);

//           // Process brand
//           let existingBrandID;
//           const searchResponse = await fetch(`http://localhost:8000/api/brands/search?query=${productName}`);
//           const searchData = await searchResponse.json();
          
//           if (searchData && searchData.data && searchData.data.length > 0) {
//             existingBrandID = searchData.data[0].id;
//             console.log(`Existing brand found with ID: ${existingBrandID}`);
//           } else {
//             console.log(`Brand not found, creating new brand: ${productName}`);
//             // Brand doesn't exist - create it
//             const createResponse = await fetch('http://localhost:8000/api/brands', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 brand_name: productName,
//               }),
//             });
            
//             if (!createResponse.ok) {
//               throw new Error(`Failed to create brand: ${createResponse.status}`);
//             }
            
//             const createdBrand = await createResponse.json();
//             existingBrandID = createdBrand.data.id;
//             console.log(`New brand created with ID: ${existingBrandID}`);
//           }

//           // Process inventory
//           console.log(`Fetching inventory for model: ${productModel}`);
//           const inventoryData = await fetchInventoryData(productModel);
//           let inventoryInfo = {};
          
//           if (inventoryData && inventoryData.data && inventoryData.data.data && inventoryData.data.data.length > 0) {
//             console.log("Inventory data found:", inventoryData.data.data[0]);
//             inventoryInfo = {
//               inventoryID: inventoryData.data.data[0].id,
//               productID: inventoryData.data.data[0].variant.product.id,
//               sku: inventoryData.data.data[0].variant.product.sku,
//               stockStatus: inventoryData.data.data[0].stock_status,
//               color: inventoryData.data.data[0].variant.color,
//               storageGb: inventoryData.data.data[0].variant.storage_gb,
//               quantity: inventoryData.data.data[0].variant.product.quantity,
//               image: inventoryData.data.data[0].variant.product.feature_imageUrl,
//               serialNumber: inventoryData.data.data[0].serial_no
//             };
//             console.log("Inventory info prepared:", inventoryInfo);
//           } else {
//             throw new Error(`Inventory data not found for model ${productModel}`);
//           }

//           // Process customer
//           const CustomerData = await fetchCustomerData(customer, cusEmail);
//           let customerInfo = {};
          
//           if (CustomerData && CustomerData.data && CustomerData.data.length > 0) {
//             console.log("Existing customer found:", CustomerData.data[0]);
//             const existingCustomerID = CustomerData.data[0].id;
//             console.log(`Fetching customer table entry for user ID: ${existingCustomerID}`);
//             const CustomerIDFinder = await fetchCustomerIDFromTable(existingCustomerID);
            
//             if (CustomerIDFinder && CustomerIDFinder.data && CustomerIDFinder.data.data && CustomerIDFinder.data.data.length > 0) {
//               console.log("Customer table entry found:", CustomerIDFinder.data.data[0]);
//               customerInfo = {
//                 customerID: existingCustomerID,
//                 customerTableId: CustomerIDFinder.data.data[0].id
//               };
//               console.log("Customer info prepared:", customerInfo);
//             } else {
//               throw new Error(`Customer table entry not found for user ${existingCustomerID}`);
//             }
//           } else {
//             console.log("Customer not found, creating new customer");
//             // Create new customer
//             const createResponse = await fetch('http://localhost:8000/api/users', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 name: customer,
//                 email: cusEmail,
//                 password: "customer123",
//                 role: "customer"
//               }),
//             });
            
//             if (!createResponse.ok) {
//               throw new Error(`Failed to create customer: ${createResponse.status}`);
//             }
            
//             const createdCustomer = await createResponse.json();
//             const newCustomerId = createdCustomer.user.id;
//             console.log(`New user created with ID: ${newCustomerId}`);
            
//             // Create customer in customers table
//             console.log("Creating customer in customers table");
//             const customerPostResponse = await fetch('http://localhost:8000/api/customers', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 user_id: newCustomerId,
//                 customer_type: "Retail"
//               }),
//             });
            
//             if (!customerPostResponse.ok) {
//               throw new Error(`Failed to add customer to customers table: ${customerPostResponse.status}`);
//             }
            
//             const customerData = await customerPostResponse.json();
//             console.log("New customer created in customers table:", customerData);
//             customerInfo = {
//               customerID: newCustomerId,
//               customerTableId: customerData.id
//             };
//             console.log("New customer info prepared:", customerInfo);
//           }

//           processedRows.push({
//             ...row,
//             inventoryInfo,
//             customerInfo,
//             brandID: existingBrandID,
//             status: 'Processed'
//           });
          
//         } catch (error) {
//           processedRows.push({
//             ...row,
//             status: 'Error',
//             error: error.message
//           });
//         }
//       }
      
//       setProcessedData(processedRows);
//       console.log("All rows processed:", processedRows);
//       toast.success("Excel file processed successfully!", {
//         position: "top-right"
//       });
      
//     } catch (error) {
//       console.error("Error processing data:", error);
//       toast.error("Error processing data. Please check console for details.", {
//         position: "top-right"
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSubmitData = async () => {
//     try {
//       setIsProcessing(true);
//       const results = [];
      
//       for (const row of processedData) {
//         try {
//           if (row.status !== 'Processed') {
//             console.log("Skipping row with status:", row.status);
//             results.push({
//               ...row,
//               orderStatus: 'Skipped',
//               orderItemStatus: 'Skipped',
//               invoiceStatus: 'Skipped'
//             });
//             continue;
//           }

//           // Generate random order number
//           const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//           // Format the date properly
//           let formattedDate;
//           if (row.date) {
//             const dateObj = new Date(row.date);
//             formattedDate =
//               dateObj.getFullYear() + '-' +
//               String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
//               String(dateObj.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00'; 
//           } else {
//             const now = new Date();
//             formattedDate =
//               now.getFullYear() + '-' +
//               String(now.getMonth() + 1).padStart(2, '0') + '-' +
//               String(now.getDate()).padStart(2, '0') + ' ' +
//               '00:00:00';
//           }

//           // Calculate due date (5 days from now)
//           const dueDateObj = new Date();
//           dueDateObj.setDate(dueDateObj.getDate() + 5);
//           const dueDate =
//             dueDateObj.getFullYear() + '-' +
//             String(dueDateObj.getMonth() + 1).padStart(2, '0') + '-' +
//             String(dueDateObj.getDate()).padStart(2, '0') + ' ' +
//             '00:00:00';

//           // Generate invoice number
//           const invoiceNumber = `INV-${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

//           // Check quantity condition
//           if (row.inventoryInfo.quantity < row.quantity) {
//             console.log(`Insufficient quantity: Available ${row.inventoryInfo.quantity}, requested ${row.quantity}`);
//             results.push({
//               ...row,
//               orderStatus: 'Failed',
//               orderItemStatus: 'Failed',
//               invoiceStatus: 'Failed',
//               error: 'Insufficient quantity'
//             });
//             continue;
//           }

//           // Create order
//           const orderData = {
//             order_number: order_number,
//             customer_id: row.customerInfo.customerTableId,
//             order_date: formattedDate,
//             status: "Pending",
//             total_amount: Number(row.product_price),
//             grand_total: Number(row.product_price),
//             payment_status: "Unpaid",
//             created_by: 1
//           };
//           console.log("Order data to create:", orderData);

//           const orderResponse = await fetch('http://localhost:8000/api/orders', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderData)
//           });

//           if (!orderResponse.ok) {
//             throw new Error(`Failed to create order: ${orderResponse.status}`);
//           }

//           const orderResult = await orderResponse.json();
//           console.log("Order created successfully:", orderResult);

//           // Create order item
//           const price_calcuation = (Number(row.product_price) * (row.quantity));
//           const orderItemData = {
//             order_id: orderResult.id,
//             inventory_id: row.inventoryInfo.inventoryID,
//             quantity: row.quantity,
//             unit_price: price_calcuation,
//             total_price: price_calcuation
//           };
//           console.log("Order item data to create:", orderItemData);

//           const orderItemResponse = await fetch('http://localhost:8000/api/order-items', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(orderItemData)
//           });

//           if (!orderItemResponse.ok) {
//             throw new Error(`Failed to create order item: ${orderItemResponse.status}`);
//           }

//           const orderItemResult = await orderItemResponse.json();
//           console.log("Order item created successfully:", orderItemResult);

//           // Create invoice
//           const invoiceData = {
//             invoice_number: invoiceNumber,
//             order_id: orderResult.id,
//             customer_id: row.customerInfo.customerTableId,
//             invoice_date: formattedDate,
//             due_date: dueDate,
//             status: "Paid",
//             template_used: " ",
//             notes: " ",
//             created_by: 1
//           };
//           console.log("Invoice data to create:", invoiceData);

//           const invoiceResponse = await fetch('http://localhost:8000/api/invoices', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(invoiceData)
//           });

//           if (!invoiceResponse.ok) {
//             throw new Error(`Failed to create invoice: ${invoiceResponse.status}`);
//           }

//           const invoiceResult = await invoiceResponse.json();
//           console.log("Invoice created successfully:", invoiceResult);

//           results.push({
//             ...row,
//             orderStatus: 'Created',
//             orderItemStatus: 'Created',
//             invoiceStatus: 'Created',
//             orderNumber: order_number,
//             invoiceNumber: invoiceNumber
//           });
//           console.log("Row submitted successfully");

//         } catch (error) {
//           console.error(`Error processing row ${row.customer_name}:`, error);
//           results.push({
//             ...row,
//             orderStatus: 'Failed',
//             orderItemStatus: 'Failed',
//             invoiceStatus: 'Failed',
//             error: error.message
//           });
//         }
//       }

//       setProcessedData(results);
//       console.log("All rows submission results:", results);
      
//       // Count successes and failures
//       const successCount = results.filter(r => r.orderStatus === 'Created').length;
//       const errorCount = results.filter(r => r.orderStatus === 'Failed').length;
      
//       if (errorCount === 0) {
//         toast.success(`All ${successCount} records processed successfully!`, {
//           position: "top-right"
//         });
//       } else if (successCount === 0) {
//         toast.error(`All ${errorCount} records failed to process.`, {
//           position: "top-right"
//         });
//       } else {
//         toast.warning(`${successCount} records succeeded, ${errorCount} records failed.`, {
//           position: "top-right"
//         });
//       }
      
//     } catch (error) {
//       console.error("Error in bulk submission:", error);
//       toast.error("Failed to complete bulk submission. Please try again.", {
//         position: "top-right"
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <React.Fragment>
//       <Row>
//         <Col>
//           <Card>
//             <CardBody>
//               {!showAddExcel ? (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Invoice Upload</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="success" onClick={handleShowExcelForm}>
//                       Upload Excel
//                     </Button>
//                   </Col>
//                 </Row>
//               ) : (
//                 <Row className="align-items-center mb-3">
//                   <Col>
//                     <CardTitle className="h4">Import Excel File</CardTitle>
//                   </Col>
//                   <Col className="text-end">
//                     <Button color="secondary" onClick={handleBackToTable}>
//                       Back
//                     </Button>
//                   </Col>
//                 </Row>
//               )}

//               {showAddExcel && (
//                 <React.Fragment>
//                   <Row className="mb-3">
//                     <Col md={12}>
//                       <Input 
//                         type="file" 
//                         accept=".xlsx, .xls" 
//                         onChange={handleFileChange} 
//                       />
//                     </Col>
//                   </Row>
//                   <Row className="mb-3">
//                     <Col className="text-end">
//                       <Button color="primary" onClick={handleImportExcel} disabled={isProcessing}>
//                         {isProcessing ? 'Processing...' : 'Import'}
//                       </Button>
//                     </Col>
//                   </Row>
//                 </React.Fragment>
//               )}

//               {(excelData.length > 0 || processedData.length > 0) && (
//                 <React.Fragment>
//                   <CardTitle className="h5">Imported Data</CardTitle>
//                   <div className="table-rep-plugin">
//                     <div className="table-responsive mb-0" data-pattern="priority-columns">
//                       <Table className="table table-striped table-bordered">
//                         <Thead>
//                           <Tr>
//                             {headers.map((header, index) => (
//                               <Th key={index}>{header}</Th>
//                             ))}
//                             <Th>Action</Th>
//                           </Tr>
//                         </Thead>
//                         <Tbody>
//                           {(processedData.length > 0 ? processedData : excelData).map((row, rowIndex) => (
//                             <Tr key={rowIndex}>
//                               {headers.map((header, cellIndex) => (
//                                 <Td key={cellIndex}>
//                                   {row[header] !== null && row[header] !== undefined && row[header] !== '' 
//                                     ? String(row[header]) 
//                                     : 'N/A'}
//                                 </Td>
//                               ))}
//                               <Td>
//                                 <Button 
//                                   color="danger" 
//                                   size="sm" 
//                                   onClick={() => handleDeleteRow(rowIndex)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </Td>
//                             </Tr>
//                           ))}
//                         </Tbody>
//                       </Table>
//                     </div>
//                   </div>
//                   {processedData.length > 0 && (
//                     <Row className="mt-3">
//                       <Col className="text-end">
//                         <Button 
//                           color="primary" 
//                           disabled={isProcessing || processedData.some(row => row.status !== 'Processed')}
//                           onClick={handleSubmitData}
//                         >
//                           {isProcessing ? 'Processing...' : 'Submit All Data'}
//                         </Button>
//                       </Col>
//                     </Row>
//                   )}
//                 </React.Fragment>
//               )}

//               {showAddExcel && excelData.length === 0 && processedData.length === 0 && (
//                 <Row>
//                   <Col>
//                     <p>No data imported yet. Please choose an Excel file and click Import.</p>
//                   </Col>
//                 </Row>
//               )}
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//       <Toaster position="top-right" richColors />
//     </React.Fragment>
//   );
// };

// export default connect(null, { setBreadcrumbItems })(InvoiceUpload);


// ___________________________________________________________ if product is not found then break the code _________________

import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import * as XLSX from "xlsx";
import { Toaster, toast } from "sonner";

const InvoiceUpload = (props) => {
  document.title = "Invoice Upload | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const [showAddExcel, setShowAddExcel] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState([]);

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Invoices", link: "#" },
    { title: "Invoice Upload", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Invoice Upload", breadcrumbItems);
  }, []);

  const handleShowExcelForm = () => {
    setShowAddExcel(true);
    setExcelFile(null);
    setExcelData([]);
    setProcessedData([]);
  };

  const handleBackToTable = () => {
    setShowAddExcel(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  const handleDeleteRow = (rowIndex) => {
    if (processedData.length > 0) {
      const newData = [...processedData];
      newData.splice(rowIndex, 1);
      setProcessedData(newData);
    } else {
      const newData = [...excelData];
      newData.splice(rowIndex, 1);
      setExcelData(newData);
    }
    toast.success("Row deleted successfully!");
  };

  const fetchInventoryData = async (model) => {
    console.log(`Fetching inventory data for model: ${model}`);
    try {
      const response = await fetch(`http://localhost:8000/api/inventory?model_name=${model}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Inventory data fetched for model ${model}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching inventory data for model ${model}:`, error);
      return null;
    }
  };

  const fetchCustomerData = async (cus_name, cus_email) => {
    console.log(`Fetching customer data for: ${cus_name}, ${cus_email}`);
    try {
      const response = await fetch(`http://localhost:8000/api/users?name=${cus_name}&email=${cus_email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Customer data fetched:", data);
      return data;
    } catch (error) {
      console.error("Error fetching customer data:", error);
      return null;
    }
  };

  const fetchCustomerIDFromTable = async (cus_id) => {
    console.log(`Fetching customer ID from table for user ID: ${cus_id}`);
    try {
      const response = await fetch(`http://localhost:8000/api/customers?user_id=${cus_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Customer table data fetched:", data);
      return data;
    } catch (error) {
      console.error("Error fetching customer ID from table:", error);
      return null;
    }
  };

  const handleImportExcel = () => {
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const binaryStr = evt.target.result;
        const wb = XLSX.read(binaryStr, { type: "binary", cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        if (data.length > 0) {
          const excelHeaders = data[0].map(header => header.trim());
          setHeaders(excelHeaders);
          
          const formattedData = data.slice(1).map(row => {
            let obj = {};
            excelHeaders.forEach((header, index) => {
              obj[header] = row[index] !== undefined ? row[index] : '';
            });
            return obj;
          });
          
          setExcelData(formattedData);
          console.log("Formatted data:", formattedData);
          processExcelData(formattedData);
        }
      };
      reader.readAsBinaryString(excelFile);
    }
  };

  const processExcelData = async (formattedData) => {
    try {
      setIsProcessing(true);
      const processedRows = [];
      let allModelsAvailable = true;
  
      // First pass: Check all product models exist and prepare initial data
      for (const row of formattedData) {
        const productModel = row.product_model;
        console.log(`Checking inventory for model: ${productModel}`);
        const inventoryData = await fetchInventoryData(productModel);
        
        if (!inventoryData || !inventoryData.data || !inventoryData.data.data || inventoryData.data.data.length === 0) {
          allModelsAvailable = false;
          processedRows.push({
            ...row,
            status: 'Error',
            error: `Product model ${productModel} not found in inventory`
          });
        } else {
          processedRows.push({
            ...row,
            status: 'Pending',
            inventoryInfo: {
              inventoryID: inventoryData.data.data[0].id,
              productID: inventoryData.data.data[0].variant.product.id,
              sku: inventoryData.data.data[0].variant.product.sku,
              stockStatus: inventoryData.data.data[0].stock_status,
              color: inventoryData.data.data[0].variant.color,
              storageGb: inventoryData.data.data[0].variant.storage_gb,
              quantity: inventoryData.data.data[0].variant.product.quantity,
              image: inventoryData.data.data[0].variant.product.feature_imageUrl,
              serialNumber: inventoryData.data.data[0].serial_no
            }
          });
        }
      }
      
      if (!allModelsAvailable) {
        setProcessedData(processedRows);
        toast.error("Some products are not available. Please check the data.", {
          position: "top-right"
        });
        setIsProcessing(false);
        return;
      }
      
      // Second pass: Process all other data only if all models are available
      for (let i = 0; i < processedRows.length; i++) {
        const row = processedRows[i];
        try {
          if (row.status === 'Error') continue;
  
          const productName = row.product_name;
          const customer = row.customer_name;
          const cusEmail = row.customer_email;
  
          console.log(`Processing product: ${productName}, model: ${row.product_model}`);
          console.log(`Customer: ${customer}, email: ${cusEmail}`);
  
          // Process brand
          let existingBrandID;
          const searchResponse = await fetch(`http://localhost:8000/api/brands/search?query=${productName}`);
          const searchData = await searchResponse.json();
          
          if (searchData && searchData.data && searchData.data.length > 0) {
            existingBrandID = searchData.data[0].id;
            console.log(`Existing brand found with ID: ${existingBrandID}`);
          } else {
            console.log(`Brand not found, creating new brand: ${productName}`);
            // Brand doesn't exist - create it
            const createResponse = await fetch('http://localhost:8000/api/brands', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                brand_name: productName,
              }),
            });
            
            if (!createResponse.ok) {
              throw new Error(`Failed to create brand: ${createResponse.status}`);
            }
            
            const createdBrand = await createResponse.json();
            existingBrandID = createdBrand.data.id;
            console.log(`New brand created with ID: ${existingBrandID}`);
          }
  
          // Process customer
          const CustomerData = await fetchCustomerData(customer, cusEmail);
          let customerInfo = {};
          
          if (CustomerData && CustomerData.data && CustomerData.data.length > 0) {
            console.log("Existing customer found:", CustomerData.data[0]);
            const existingCustomerID = CustomerData.data[0].id;
            console.log(`Fetching customer table entry for user ID: ${existingCustomerID}`);
            const CustomerIDFinder = await fetchCustomerIDFromTable(existingCustomerID);
            
            if (CustomerIDFinder && CustomerIDFinder.data && CustomerIDFinder.data.data && CustomerIDFinder.data.data.length > 0) {
              console.log("Customer table entry found:", CustomerIDFinder.data.data[0]);
              customerInfo = {
                customerID: existingCustomerID,
                customerTableId: CustomerIDFinder.data.data[0].id
              };
              console.log("Customer info prepared:", customerInfo);
            } else {
              throw new Error(`Customer table entry not found for user ${existingCustomerID}`);
            }
          } else {
            console.log("Customer not found, creating new customer");
            // Create new customer
            const createResponse = await fetch('http://localhost:8000/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: customer,
                email: cusEmail,
                password: "customer123",
                role: "customer"
              }),
            });
            
            if (!createResponse.ok) {
              throw new Error(`Failed to create customer: ${createResponse.status}`);
            }
            
            const createdCustomer = await createResponse.json();
            const newCustomerId = createdCustomer.user.id;
            console.log(`New user created with ID: ${newCustomerId}`);
            
            // Create customer in customers table
            console.log("Creating customer in customers table");
            const customerPostResponse = await fetch('http://localhost:8000/api/customers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: newCustomerId,
                customer_type: "Retail"
              }),
            });
            
            if (!customerPostResponse.ok) {
              throw new Error(`Failed to add customer to customers table: ${customerPostResponse.status}`);
            }
            
            const customerData = await customerPostResponse.json();
            console.log("New customer created in customers table:", customerData);
            customerInfo = {
              customerID: newCustomerId,
              customerTableId: customerData.id
            };
            console.log("New customer info prepared:", customerInfo);
          }
  
          // Update the existing row instead of pushing a new one
          processedRows[i] = {
            ...row,
            customerInfo,
            brandID: existingBrandID,
            status: 'Processed'
          };
          
        } catch (error) {
          processedRows[i] = {
            ...row,
            status: 'Error',
            error: error.message
          };
        }
      }
      
      setProcessedData(processedRows);
      console.log("All rows processed:", processedRows);
      
      if (processedRows.every(row => row.status === 'Processed')) {
        toast.success("Excel file processed successfully!", {
          position: "top-right"
        });
      } else {
        toast.warning("Some rows had errors during processing", {
          position: "top-right"
        });
      }
      
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("Error processing data. Please check console for details.", {
        position: "top-right"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitData = async () => {
    try {
      setIsProcessing(true);
      const results = [];
      
      for (const row of processedData) {
        try {
          if (row.status !== 'Processed') {
            console.log("Skipping row with status:", row.status);
            results.push({
              ...row,
              orderStatus: 'Skipped',
              orderItemStatus: 'Skipped',
              invoiceStatus: 'Skipped'
            });
            continue;
          }

          // Generate random order number
          const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

          // Format the date properly
          let formattedDate;
          if (row.date) {
            const dateObj = new Date(row.date);
            formattedDate =
              dateObj.getFullYear() + '-' +
              String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
              String(dateObj.getDate()).padStart(2, '0') + ' ' +
              '00:00:00'; 
          } else {
            const now = new Date();
            formattedDate =
              now.getFullYear() + '-' +
              String(now.getMonth() + 1).padStart(2, '0') + '-' +
              String(now.getDate()).padStart(2, '0') + ' ' +
              '00:00:00';
          }

          // Calculate due date (5 days from now)
          const dueDateObj = new Date();
          dueDateObj.setDate(dueDateObj.getDate() + 5);
          const dueDate =
            dueDateObj.getFullYear() + '-' +
            String(dueDateObj.getMonth() + 1).padStart(2, '0') + '-' +
            String(dueDateObj.getDate()).padStart(2, '0') + ' ' +
            '00:00:00';

          // Generate invoice number
          const invoiceNumber = `INV-${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

          // Check quantity condition
          if (row.inventoryInfo.quantity < row.quantity) {
            console.log(`Insufficient quantity: Available ${row.inventoryInfo.quantity}, requested ${row.quantity}`);
            results.push({
              ...row,
              orderStatus: 'Failed',
              orderItemStatus: 'Failed',
              invoiceStatus: 'Failed',
              error: 'Insufficient quantity'
            });
            continue;
          }

          // Create order
          const orderData = {
            order_number: order_number,
            customer_id: row.customerInfo.customerTableId,
            order_date: formattedDate,
            status: "Pending",
            total_amount: Number(row.product_price),
            grand_total: Number(row.product_price),
            payment_status: "Unpaid",
            created_by: 1
          };
          console.log("Order data to create:", orderData);

          const orderResponse = await fetch('http://localhost:8000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
          });

          if (!orderResponse.ok) {
            throw new Error(`Failed to create order: ${orderResponse.status}`);
          }

          const orderResult = await orderResponse.json();
          console.log("Order created successfully:", orderResult);

          // Create order item
          const price_calcuation = (Number(row.product_price) * (row.quantity));
          const orderItemData = {
            order_id: orderResult.id,
            inventory_id: row.inventoryInfo.inventoryID,
            quantity: row.quantity,
            unit_price: price_calcuation,
            total_price: price_calcuation
          };
          console.log("Order item data to create:", orderItemData);

          const orderItemResponse = await fetch('http://localhost:8000/api/order-items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderItemData)
          });

          if (!orderItemResponse.ok) {
            throw new Error(`Failed to create order item: ${orderItemResponse.status}`);
          }

          const orderItemResult = await orderItemResponse.json();
          console.log("Order item created successfully:", orderItemResult);

          // Create invoice
          const invoiceData = {
            invoice_number: invoiceNumber,
            order_id: orderResult.id,
            customer_id: row.customerInfo.customerTableId,
            invoice_date: formattedDate,
            due_date: dueDate,
            status: "Paid",
            template_used: " ",
            notes: " ",
            created_by: 1
          };
          console.log("Invoice data to create:", invoiceData);

          const invoiceResponse = await fetch('http://localhost:8000/api/invoices', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData)
          });

          if (!invoiceResponse.ok) {
            throw new Error(`Failed to create invoice: ${invoiceResponse.status}`);
          }

          const invoiceResult = await invoiceResponse.json();
          console.log("Invoice created successfully:", invoiceResult);

          results.push({
            ...row,
            orderStatus: 'Created',
            orderItemStatus: 'Created',
            invoiceStatus: 'Created',
            orderNumber: order_number,
            invoiceNumber: invoiceNumber
          });
          console.log("Row submitted successfully");

        } catch (error) {
          console.error(`Error processing row ${row.customer_name}:`, error);
          results.push({
            ...row,
            orderStatus: 'Failed',
            orderItemStatus: 'Failed',
            invoiceStatus: 'Failed',
            error: error.message
          });
        }
      }

      setProcessedData(results);
      console.log("All rows submission results:", results);
      
      // Count successes and failures
      const successCount = results.filter(r => r.orderStatus === 'Created').length;
      const errorCount = results.filter(r => r.orderStatus === 'Failed').length;
      
      if (errorCount === 0) {
        toast.success(`All ${successCount} records processed successfully!`, {
          position: "top-right"
        });
      } else if (successCount === 0) {
        toast.error(`All ${errorCount} records failed to process.`, {
          position: "top-right"
        });
      } else {
        toast.warning(`${successCount} records succeeded, ${errorCount} records failed.`, {
          position: "top-right"
        });
      }
      
    } catch (error) {
      console.error("Error in bulk submission:", error);
      toast.error("Failed to complete bulk submission. Please try again.", {
        position: "top-right"
      });
    } finally {
      setIsProcessing(false);
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
                    <CardTitle className="h4">Invoice Upload</CardTitle>
                  </Col>
                  <Col className="text-end">
                    <Button color="success" onClick={handleShowExcelForm}>
                      Upload Excel
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
                      Back
                    </Button>
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
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col className="text-end">
                      <Button color="primary" onClick={handleImportExcel} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Import'}
                      </Button>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {(excelData.length > 0 || processedData.length > 0) && (
                <React.Fragment>
                  <CardTitle className="h5">Imported Data</CardTitle>
                  <div className="table-rep-plugin">
                    <div className="table-responsive mb-0" data-pattern="priority-columns">
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
                          {(processedData.length > 0 ? processedData : excelData).map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {headers.map((header, cellIndex) => (
                                <Td key={cellIndex}>
                                  {row[header] !== null && row[header] !== undefined && row[header] !== '' 
                                    ? String(row[header]) 
                                    : 'N/A'}
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
                  </div>
                  {processedData.length > 0 && (
                    <Row className="mt-3">
                      <Col className="text-end">
                        <Button 
                          color="primary" 
                          disabled={isProcessing || processedData.some(row => row.status !== 'Processed')}
                          onClick={handleSubmitData}
                        >
                          {isProcessing ? 'Processing...' : 'Submit All Data'}
                        </Button>
                      </Col>
                    </Row>
                  )}
                </React.Fragment>
              )}

              {showAddExcel && excelData.length === 0 && processedData.length === 0 && (
                <Row>
                  <Col>
                    <p>No data imported yet. Please choose an Excel file and click Import.</p>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Toaster position="top-right" richColors />
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(InvoiceUpload);