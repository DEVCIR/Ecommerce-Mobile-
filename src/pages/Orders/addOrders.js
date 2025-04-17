import React, { useEffect, useState } from "react"
import {Card, CardBody, Col, Row, Button } from "reactstrap"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

const AddOrder = (props) => {
  document.title = "Order Now | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Orders", link: "#" },
    { title: "Order Now", link: "#" },
  ]

  const [customers, setCustomers] = useState([]);
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});

  const [formData, setFormData] = useState({
    customerName: "",
    orderDate: new Date().toLocaleDateString('en-CA'),
    status: "Pending",
    taxAmount: "100",
    shippingAmount: "100",
    shippingAddress: "", 
    paymentMethod: "",
    paymentStatus: "Unpaid",
    totalDiscount: "0",
    notes: ""
  });

  useEffect(() => {
    props.setBreadcrumbItems('Order Now', breadcrumbItems);
    
    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/customers");
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();            
            if (result.data && result.data.data && Array.isArray(result.data.data)) {
                setCustomers(result.data.data);
            } else {
                console.error("Unexpected data format:", result);
                setCustomers([]);
                toast.error("Received unexpected data format from server");
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            setCustomers([]);
            toast.error("Failed to load customers. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/inventory");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.data && result.data.data && Array.isArray(result.data.data)) {
                const activeInventory = result.data.data.filter(item => 
                    item.is_active && 
                    item.variant?.product?.is_active
                );
                setInventory(activeInventory);
            }
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast.error("Failed to load products");
        }
    };

    fetchCustomers();
    fetchInventory();

    if (location.state) {
        if (location.state.productId) {
            const product = inventory.find(item => item.id === location.state.productId);
            if (product) {
                setSelectedProducts([{
                    value: product.id,
                    label: product.variant?.product?.model_name || "Unknown Product",
                    price: product.selling_price || 0,
                    discount : product.discount_price || 0,
                    discount_type : product.discount_type || ''
                }]);
                setProductQuantities({
                    [product.id]: location.state.quantity || 1
                });
            }
        }
    }
  }, [location.state, props]);

  const calculateTotalAmount = () => {
    return selectedProducts.reduce((total, product) => {
      const quantity = productQuantities[product.value] || 1;
      return total + (parseFloat ((product.price) - (product.discount)) * quantity);
    }, 0);
  };

  const calculateGrandTotal = () => {
    const totalAmount = calculateTotalAmount();
    return (totalAmount + 
           parseFloat(formData.taxAmount || 0) + 
           parseFloat(formData.shippingAmount || 0)).toFixed(2);
  };

  const calculateTotalDiscount = () => {
    return selectedProducts.reduce((total, product) => {
      const quantity = productQuantities[product.value] || 1;
      return total + (parseFloat(product.discount) * quantity);
    }, 0).toFixed(2);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleProductChange = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
    
    // Initialize quantities for new products
    const newQuantities = {...productQuantities};
    selectedOptions.forEach(product => {
      if (!newQuantities[product.value]) {
        newQuantities[product.value] = 1;
      }
    });
    setProductQuantities(newQuantities);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setProductQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const selectedCustomer = customers.find(c => c.user.name === formData.customerName);      
      if (!selectedCustomer) {
        alert("Please select a customer");
        setIsSubmitting(false);
        return;
      }

      if (selectedProducts.length === 0) {
        alert("Please select at least one product");
        setIsSubmitting(false);
        return;
      }
  
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        customer_id: selectedCustomer.id,
        created_by: selectedCustomer.user_id,
        order_date: formData.orderDate,
        status: formData.status,
        discount_amount: calculateTotalDiscount(),
        total_amount: calculateTotalAmount(),
        tax_amount: formData.taxAmount,
        shipping_amount: formData.shippingAmount,
        grand_total: calculateGrandTotal(),
        payment_method: formData.paymentMethod,
        payment_status: formData.paymentStatus,
        shipping_address: formData.shippingAddress,
        notes: formData.notes,
        is_active: 1
      };
  
      const orderResponse = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      });
  
      const orderResult = await orderResponse.json();
  
      if (!orderResponse.ok) {
        throw new Error(orderResult.message || "Failed to create order");
      }
  
      // Create order items for each selected product
      for (const product of selectedProducts) {
        const orderItemData = {
          order_id: orderResult.id,  
          inventory_id: product.value,
          quantity: productQuantities[product.value] || 1,
          unit_price: product.price,
          discount_amount: (product.discount) * (productQuantities[product.value] || 1),
          total_price: (product.price - ( ( product.discount)  * (productQuantities[product.value] || 1))),
        };

        console.log("mm", orderItemData);
  
        const orderItemResponse = await fetch("http://localhost:8000/api/order-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItemData)
        });
  
        if (!orderItemResponse.ok) {
          const orderItemResult = await orderItemResponse.json();
          throw new Error(orderItemResult.message || "Failed to create order items");
        }
      }
        // Utility functions

const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(100 + Math.random() * 900); // e.g. 123
    return `INV-${year}${randomDigits}`;
  };
  
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5); // Add 5 days
    return date.toISOString().split("T")[0];
  };
  
  
  // Main object
  const invoiceData = {
    invoice_number: generateInvoiceNumber(),
    order_id: orderResult.id,
    customer_id: selectedCustomer.id,
    created_by: selectedCustomer.user_id,
    invoice_date: getTodayDate(),
    due_date: getDueDate(),
    status: "Paid",
    template_used: "Standard",
    notes: "This is a test invoice",
    is_active: 1,
  };
  
  console.log("My Invoice ",invoiceData)

const invoiceResponse = await fetch("http://localhost:8000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData)
      });

      if (!invoiceResponse.ok) {
        const invoiceResult = await invoiceResponse.json();
        throw new Error(invoiceResult.message || "Failed to create order items");
      }

    toast.success("Order has been placed successfully");
      setTimeout(() => {
        props.onBackClick();
      }, 2000);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inventoryOptions = inventory.map(item => ({
    value: item.id,
    label: item.variant?.product?.model_name || "Unknown Product",
    price: item.selling_price || 0,
    discount : item.discount_price || 0,
    discount_type : item.discount_type || ''
  }));

  return (
    <React.Fragment>
        <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
                
            <Button 
                color="secondary" 
                onClick={props.onBackClick}
                style={{ marginBottom: '20px' }}
            >
                ← Back to Orders
            </Button>

              <Row className="mb-3">
                <label htmlFor="customerName" className="col-md-2 col-form-label">
                  Customer Name
                </label>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  >
                    <option value="">{isLoading ? "Loading customers..." : "Select Customer"}</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.user.name}>
                            {customer.user.name} {customer.user.last_name && `(${customer.user.last_name})`}
                        </option>
                    ))}
                  </select>
                </div>
              </Row>

              <Row className="mb-3">
  <label htmlFor="productSelect" className="col-md-2 col-form-label">
    Products
  </label>
  <div className="col-md-10">
    <Select
      isMulti
      options={inventoryOptions}
      value={selectedProducts}
      onChange={handleProductChange}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Select products..."
    />
  </div>
</Row>
              
{selectedProducts.map(product => (

<>
{console.log("Is db: ",product)}
<Row className="mb-3">
  <label htmlFor="productPrice" className="col-md-2 col-form-label">
  {product.label} Price
  </label>
  <div className="col-md-10">
    <input
      className="form-control"
      type="text"
      id="productPrice"
      name="productPrice"
   value={product.price}
      readOnly
    />
  </div>
</Row>



<Row className="mb-3" >
   <label htmlFor="productPrice" className="col-md-2 col-form-label">
   {product.label}  Discount
  </label>
  <div className="col-md-10">
    
    <input
      className="form-control"
      type="text"
      id="discountPrice"
      name="discountPrice"
   value={(product.discount*(productQuantities[product.value] || 1))}
      readOnly
    />
  </div>
</Row>



  <Row className="mb-3" key={product.value}>
    <label className="col-md-2 col-form-label">
      {product.label} Quantity
    </label>
    <div className="col-md-10">
      <div className="input-group" style={{ maxWidth: '200px' }}>
        <button 
          className="btn btn-outline-secondary" 
          type="button"
          onClick={() => handleQuantityChange(product.value, (productQuantities[product.value] || 1) - 1)}
          disabled={(productQuantities[product.value] || 1) <= 1} 
        >
          -
        </button>
        <input
          type="number"
          className="form-control text-center"
          value={productQuantities[product.value] || 1}
          onChange={(e) => handleQuantityChange(product.value, parseInt(e.target.value) || 1)}
          min="1"
          style={{ width: '60px' }}
        />
        <button 
          className="btn btn-outline-secondary" 
          type="button"
          onClick={() => handleQuantityChange(product.value, (productQuantities[product.value] || 1) + 1)}
        >
          +
        </button>
      </div>
    </div>
  </Row>



  <Row className="mb-3" >
   <label htmlFor="TotalAmount" className="col-md-2 col-form-label">
   {product.label} Total 
  </label>
  <div className="col-md-10">
    
    <input
      className="form-control"
      type="text"
      id="totalPrice"
      name="totalPrice"
   value={(product.price)-(product.discount*(productQuantities[product.value] || 1))}
      readOn
    />
  </div>
</Row>


  </>

))}

              
              <Row className="mb-3">
                <label htmlFor="orderDate" className="col-md-2 col-form-label">
                  Order Date
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="date"
                    id="orderDate"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              </Row>
              
              <Row className="mb-3">
                <label htmlFor="status" className="col-md-2 col-form-label">
                  Status
                </label>
                <div className="col-md-10">
                  <select
                    className="form-control w-100" 
                    style={{ maxWidth: "100%" }}
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </Row>

              <Row className="mb-3">
                <label htmlFor="taxAmount" className="col-md-2 col-form-label">
                  Tax Amount
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="number"
                    id="taxAmount"
                    name="taxAmount"
                    value={formData.taxAmount}
                    onChange={handleInputChange}
                  />
                </div>
              </Row>
              
              <Row className="mb-3">
                <label htmlFor="shippingAmount" className="col-md-2 col-form-label">
                  Shipping Amount
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="number"
                    id="shippingAmount"
                    name="shippingAmount"
                    value={formData.shippingAmount}
                    onChange={handleInputChange}
                  />
                </div>
              </Row>

              <Row className="mb-3">
  <label htmlFor="totalAmount" className="col-md-2 col-form-label">
    Total Amount
  </label>
  <div className="col-md-10">
    <input
      className="form-control"
      type="number"
      id="totalAmount"
      name="totalAmount"
      value={selectedProducts.reduce((total, product) => {
        const quantity = productQuantities[product.value] || 1;
        return total + (parseFloat((product.price) - (product.discount))  * quantity)  ;
      }, 0).toFixed(2)}
      readOnly
    />
  </div>
</Row>

              <Row className="mb-3">
                <label htmlFor="shippingAddress" className="col-md-2 col-form-label">
                  Shipping Address
                </label>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter full shipping address"
                  />
                </div>
              </Row>

              <Row className="mb-3">
  <label htmlFor="grandTotal" className="col-md-2 col-form-label">
    Total Discount
  </label>
  <div className="col-md-10">
    <input
      className="form-control"
      type="text"
      id="totalDiscount"
      name="totalDiscount"
      value={calculateTotalDiscount()}
      readOnly
    />
  </div>
</Row>
              
              <Row className="mb-3">
                <label htmlFor="grandTotal" className="col-md-2 col-form-label">
                  Grand Total
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="text"
                    id="grandTotal"
                    name="grandTotal"
                    value={calculateGrandTotal()}
                    readOnly
                  />
                </div>
              </Row>
              
              <Row className="mb-3">
                <label htmlFor="paymentMethod" className="col-md-2 col-form-label">
                  Payment Method
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="text"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    placeholder="e.g., Credit Card, PayPal"
                  />
                </div>
              </Row>
              
              <Row className="mb-3">
                <label htmlFor="paymentStatus" className="col-md-2 col-form-label">
                  Payment Status
                </label>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </Row>
              
              <Row className="mb-3">
                <label htmlFor="notes" className="col-md-2 col-form-label">
                  Notes
                </label>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </Row>

              <Row className="mt-4">
                <Col className="text-end">
                  <Button 
                    color="primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedProducts.length === 0}
                  >
                    {isSubmitting ? "Processing..." : "Order"}
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AddOrder);