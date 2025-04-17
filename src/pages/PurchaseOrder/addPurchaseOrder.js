// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Row,
//   CardTitle,
//   FormGroup,
//   Form,
//   Label,
//   Input,
//   Button,
// } from "reactstrap";
// import { Toaster, toast } from "sonner";
// import Select from 'react-select';

// function AddPurchaseOrder({ onBackClick, setViewToTable }) {
//   document.title = "Add Purchase Order | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
//   // Set default dates
//   const today = new Date();
//   const deliveryDate = new Date();
//   deliveryDate.setDate(today.getDate() + 5);
  
//   const formatDate = (date) => {
//     return date.toISOString().split('T')[0];
//   };

//   const generatePONumber = () => {
//     const randomNum = Math.floor(10000 + Math.random() * 90000);
//     return `PO-${randomNum}`;
//   };

//   const [suppliers, setSuppliers] = useState([]);
//   const [loadingSuppliers, setLoadingSuppliers] = useState(true);
//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([]);

// const [formData, setFormData] = useState({
//   supplier_id: "",
//   po_number: generatePONumber(),
//   order_date: formatDate(today),
//   expected_delivery_date: formatDate(deliveryDate),
//   status: "Draft",
//   notes: "Urgent delivery required.",
//   created_by: 2,
//   });

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/suppliers");
//         const result = await response.json();
//         if (result.data) {
//           setSuppliers(result.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching suppliers:", error);
//         toast.error("Failed to load suppliers");
//       } finally {
//         setLoadingSuppliers(false);
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   useEffect(()=>{
// console.log("Products ",selectedProducts);
//   },[selectedProducts])
  
//   const handleSupplierChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setSelectedProducts([]);

//     if (value) {
//       setLoadingProducts(true);
//       try {
//         const response = await fetch(`http://localhost:8000/api/inventory?supplier_id=${value}`);
//         const result = await response.json();
//         if (result.data?.data) {
//           setProducts(result.data.data.map(product => ({
//             ...product,
//             label: `${product.variant.product.model_name}`,
//             value: product.id,  // Changed from user_id to product id
//             price: parseFloat(product.purchase_price) || 0,
//             variant_id: `${product.variant.id}`,
//             product_id: `${product.variant.product.id}`,
//           })));
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         toast.error("Failed to load products");
//       } finally {
//         setLoadingProducts(false);
//       }
//     }
//   };

//   const handleProductSelect = (selectedOptions) => {
//     // Merge new selections with existing ones, avoiding duplicates
//     const newSelectedProducts = selectedOptions.map(option => {
//       const existingProduct = selectedProducts.find(p => p.value === option.value);
//       return existingProduct || { ...option, quantity: 1 };
//     });
    
//     setSelectedProducts(newSelectedProducts);
//   };

//   const handleQuantityChange = (productId, value) => {
//     const quantity = Math.max(1, parseInt(value) || 1);
//     setSelectedProducts(prev => 
//       prev.map(product => 
//         product.value === productId ? { ...product, quantity } : product
//       )
//     );
//   };

//   const removeProduct = (productId) => {
//     setSelectedProducts(prev => prev.filter(product => product.value !== productId));
//   };

//   const calculateTotalQuantity = () => {
//     return selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
//   };

//   const calculateTotalAmount = () => {
//     return selectedProducts.reduce((sum, product) => {
//       return sum + (product.price * product.quantity);
//     }, 0);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.supplier_id) {
//       toast.error("Please select a supplier");
//       return;
//     }

//     if (selectedProducts.length === 0) {
//       toast.error("Please select at least one product");
//       return;
//     }

//     const payload = {
//       ...formData,    
//       quantity: calculateTotalQuantity(),
//       total_amount: calculateTotalAmount(),
//     };

//     try {
//       const response = await fetch("http://localhost:8000/api/purchase-orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       toast.success("Purchase order created successfully");
//       setTimeout(() => {
//         setViewToTable();
//       }, 1500);
      
//     } catch (error) {
//       console.error("Error creating purchase order:", error);
//       toast.error("Failed to create purchase order");
//     }
//   };

//   return (
//     <React.Fragment>
//       <Toaster position="top-right" richColors />
//       <Row>
//         <Col>
//           <Card>
//             <CardBody>
//               <CardTitle className="h4">Add Purchase Order</CardTitle>
//               <Form>
//                 {/* Supplier */}
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">Supplier</Label>
//                   <Col md={10}>
//                     {loadingSuppliers ? (
//                       <Input type="select" disabled>
//                         <option>Loading suppliers...</option>
//                       </Input>
//                     ) : (
//                       <Input
//                         type="select"
//                         name="supplier_id"
//                         value={formData.supplier_id}
//                         onChange={handleSupplierChange}
//                         required
//                       >
//                         <option value="">Select Supplier</option>
//                         {suppliers.map(supplier => (
//                           <option key={supplier.id} value={supplier.id}>
//                             {supplier.user.name}
//                           </option>
//                         ))}
//                       </Input>
//                     )}
//                   </Col>
//                 </Row>

//                 {/* PO Number */}
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">PO Number</Label>
//                   <Col md={10}>
//                     <Input type="text" value={formData.po_number} readOnly />
//                   </Col>
//                 </Row>

//                 {/* Products */}
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">Products</Label>
//                   <Col md={10}>
//                     <Select
//                       isMulti
//                       options={products}
//                       onChange={handleProductSelect}
//                       value={selectedProducts}
//                       isDisabled={!formData.supplier_id || products.length === 0}
//                       placeholder={loadingProducts ? "Loading products..." : "Select products..."}
//                       isLoading={loadingProducts}
//                     />
//                   </Col>
//                 </Row>

//                 {/* Selected Products List */}
//                 {selectedProducts.length > 0 && (
//                   <div className="mb-4">
//                     <h5 className="mb-3">Selected Products</h5>
//                     {selectedProducts.map((product, index) => (
//                       <div key={product.value} className="border p-3 mb-3">
//                         <Row className="align-items-center">
//                           <Col md={4}>
//                             <FormGroup>
//                               <Label>Product Name</Label>
//                               <Input type="text" value={product.label} readOnly />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label>Unit Price</Label>
//                               <Input type="text" value={`$${product.price.toFixed(2)}`} readOnly />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label>Quantity</Label>
//                               <Input
//                                 type="number"
//                                 min="1"
//                                 value={product.quantity}
//                                 onChange={(e) => handleQuantityChange(product.value, e.target.value)}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label>Total</Label>
//                               <Input 
//                                 type="text" 
//                                 value={`$${(product.price * product.quantity).toFixed(2)}`} 
//                                 readOnly 
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2} className="text-end">
//                             <Button 
//                               color="danger" 
//                               size="sm" 
//                               onClick={() => removeProduct(product.value)}
//                             >
//                               Remove
//                             </Button>
//                           </Col>
//                         </Row>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Totals */}
//                 {selectedProducts.length > 0 && (
//                   <div className="border-top pt-3 mb-4">
//                     <Row className="mb-2">
//                       <Col md={{ offset: 8, size: 4 }}>
//                         <div className="d-flex justify-content-between">
//                           <strong>Total Quantity:</strong>
//                           <span>{calculateTotalQuantity()}</span>
//                         </div>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col md={{ offset: 8, size: 4 }}>
//                         <div className="d-flex justify-content-between">
//                           <strong>Total Amount:</strong>
//                           <span>${calculateTotalAmount().toFixed(2)}</span>
//                         </div>
//                       </Col>
//                     </Row>
//                   </div>
//                 )}

//                 {/* Dates */}
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">Order Date</Label>
//                   <Col md={10}>
//                     <Input type="date" name="order_date" value={formData.order_date} readOnly />
//                   </Col>
//                 </Row>
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">Expected Delivery Date</Label>
//                   <Col md={10}>
//                     <Input 
//                       type="date" 
//                       name="expected_delivery_date" 
//                       value={formData.expected_delivery_date} 
//                       onChange={handleChange}
//                     />
//                   </Col>
//                 </Row>

//                 {/* Status */}
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">Status</Label>
//                   <Col md={10}>
//                     <Input type="text" value={formData.status} readOnly />
//                   </Col>
//                 </Row>

//                 {/* Notes */}
//                 <Row className="mb-3">
//                   <Label className="col-md-2 col-form-label">Notes</Label>
//                   <Col md={10}>
//                     <Input 
//                       type="textarea" 
//                       name="notes" 
//                       value={formData.notes} 
//                       onChange={handleChange} 
//                       rows="3"
//                     />
//                   </Col>
//                 </Row>

//                 {/* Buttons */}
//                 <Row className="mb-3">
//                   <Col className="text-end">
//                     <Button color="secondary" onClick={onBackClick} className="me-2">Back</Button>
//                     <Button color="primary" onClick={handleSubmit}>Save</Button>
//                   </Col>
//                 </Row>
//               </Form>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </React.Fragment>
//   );
// }

// export default AddPurchaseOrder;


import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  FormGroup,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Toaster, toast } from "sonner";
import Select from 'react-select';

function AddPurchaseOrder({ onBackClick, setViewToTable }) {
  document.title = "Add Purchase Order | Lexa - Responsive Bootstrap 5 Admin Dashboard";
  
  // Set default dates
  const today = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + 5);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const generatePONumber = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `PO-${randomNum}`;
  };

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    supplier_id: "",
    po_number: generatePONumber(),
    order_date: formatDate(today),
    expected_delivery_date: formatDate(deliveryDate),
    status: "Draft",
    notes: "Urgent delivery required.",
    created_by: 2,
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/suppliers");
        const result = await response.json();
        if (result.data) {
          setSuppliers(result.data.data);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to load suppliers");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSupplierChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedProducts([]);

    if (value) {
      setLoadingProducts(true);
      try {
        const response = await fetch(`http://localhost:8000/api/inventory?supplier_id=${value}`);
        const result = await response.json();
        if (result.data?.data) {
          setProducts(result.data.data.map(product => ({
            ...product,
            label: `${product.variant.product.model_name}`,
            value: product.id,
            price: parseFloat(product.purchase_price) || 0,
            variant_id: `${product.variant.id}`,
            product_id: `${product.variant.product.id}`,
          })));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleProductSelect = (selectedOptions) => {
    const newSelectedProducts = selectedOptions.map(option => {
      const existingProduct = selectedProducts.find(p => p.value === option.value);
      return existingProduct || { ...option, quantity: 1 };
    });
    
    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setSelectedProducts(prev => 
      prev.map(product => 
        product.value === productId ? { ...product, quantity } : product
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(product => product.value !== productId));
  };

  const calculateTotalQuantity = () => {
    return selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
  };

  const calculateTotalAmount = () => {
    return selectedProducts.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createPurchaseOrderItems = async (poId) => {
    console.log("nnnn ", poId);
    console.log("pppp ", selectedProducts);
    try {
      // Create an array of promises for all the product items
      const itemPromises = selectedProducts.map(async (product) => {
        const itemData = {
          po_id: poId,
          product_id: product.product_id,
          variant_id: product.variant_id,
          quantity: product.quantity,
          unit_price: product.price,
          total_price: product.price * product.quantity,
          received_quantity: 0,
          is_active: true
        };

        const response = await fetch("http://localhost:8000/api/purchase-order-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create purchase order item for product ${product.product_id}`);
        }

        return response.json();
      });

      // Wait for all items to be created
      await Promise.all(itemPromises);
      return true;
    } catch (error) {
      console.error("Error creating purchase order items:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.supplier_id) {
      toast.error("Please select a supplier");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create the purchase order
      const poResponse = await fetch("http://localhost:8000/api/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,    
          quantity: calculateTotalQuantity(),
          total_amount: calculateTotalAmount(),
        }),
      });

      if (!poResponse.ok) {
        throw new Error(`HTTP error! status: ${poResponse.status}`);
      }

      const poResult = await poResponse.json();
      const poId = poResult.id;

      // Then create all the purchase order items
      await createPurchaseOrderItems(poId);

      toast.success("Purchase order created successfully");
      setTimeout(() => {
        setViewToTable();
      }, 1500);
      
    } catch (error) {
      console.error("Error in purchase order creation:", error);
      toast.error("Failed to create purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Purchase Order</CardTitle>
              <Form>
                {/* Supplier */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Supplier</Label>
                  <Col md={10}>
                    {loadingSuppliers ? (
                      <Input type="select" disabled>
                        <option>Loading suppliers...</option>
                      </Input>
                    ) : (
                      <Input
                        type="select"
                        name="supplier_id"
                        value={formData.supplier_id}
                        onChange={handleSupplierChange}
                        required
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.user.name}
                          </option>
                        ))}
                      </Input>
                    )}
                  </Col>
                </Row>

                {/* PO Number */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">PO Number</Label>
                  <Col md={10}>
                    <Input type="text" value={formData.po_number} readOnly />
                  </Col>
                </Row>

                {/* Products */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Products</Label>
                  <Col md={10}>
                    <Select
                      isMulti
                      options={products}
                      onChange={handleProductSelect}
                      value={selectedProducts}
                      isDisabled={!formData.supplier_id || products.length === 0}
                      placeholder={loadingProducts ? "Loading products..." : "Select products..."}
                      isLoading={loadingProducts}
                    />
                  </Col>
                </Row>

                {/* Selected Products List */}
                {selectedProducts.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Selected Products</h5>
                    {selectedProducts.map((product, index) => (
                      <div key={product.value} className="border p-3 mb-3">
                        <Row className="align-items-center">
                          <Col md={4}>
                            <FormGroup>
                              <Label>Product Name</Label>
                              <Input type="text" value={product.label} readOnly />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label>Unit Price</Label>
                              <Input type="text" value={`$${product.price.toFixed(2)}`} readOnly />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(product.value, e.target.value)}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label>Total</Label>
                              <Input 
                                type="text" 
                                value={`$${(product.price * product.quantity).toFixed(2)}`} 
                                readOnly 
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2} className="text-end">
                            <Button 
                              color="danger" 
                              size="sm" 
                              onClick={() => removeProduct(product.value)}
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals */}
                {selectedProducts.length > 0 && (
                  <div className="border-top pt-3 mb-4">
                    <Row className="mb-2">
                      <Col md={{ offset: 8, size: 4 }}>
                        <div className="d-flex justify-content-between">
                          <strong>Total Quantity:</strong>
                          <span>{calculateTotalQuantity()}</span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={{ offset: 8, size: 4 }}>
                        <div className="d-flex justify-content-between">
                          <strong>Total Amount:</strong>
                          <span>${calculateTotalAmount().toFixed(2)}</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Dates */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Order Date</Label>
                  <Col md={10}>
                    <Input type="date" name="order_date" value={formData.order_date} readOnly />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Expected Delivery Date</Label>
                  <Col md={10}>
                    <Input 
                      type="date" 
                      name="expected_delivery_date" 
                      value={formData.expected_delivery_date} 
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                {/* Status */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Status</Label>
                  <Col md={10}>
                    <Input type="text" value={formData.status} readOnly />
                  </Col>
                </Row>

                {/* Notes */}
                <Row className="mb-3">
                  <Label className="col-md-2 col-form-label">Notes</Label>
                  <Col md={10}>
                    <Input 
                      type="textarea" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleChange} 
                      rows="3"
                    />
                  </Col>
                </Row>

                {/* Buttons */}
                <Row className="mb-3">
                  <Col className="text-end">
                    <Button color="secondary" onClick={onBackClick} className="me-2">Back</Button>
                    <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default AddPurchaseOrder;