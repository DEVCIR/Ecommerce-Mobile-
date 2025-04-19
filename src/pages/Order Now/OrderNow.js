import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  Button
} from "reactstrap"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";


const OrderNow = (props) => {
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
  const [productId, setProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    customerName: "",
    orderDate: new Date().toLocaleDateString('en-CA'),
    status: "Pending",
    totalAmount: "",
    discountAmount: "",
    taxAmount: "100",
    shippingAmount: "100",
    shippingAddress: "", 
    grandTotal: "",
    paymentMethod: "",
    paymentStatus: "Unpaid",
    notes: "",
    quantity: 1
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
            // Access the nested data array
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

    fetchCustomers();

    // Check for passed state from navigation
    if (location.state) {
        console.log("Product ID from navigation:", location.state.productId);
        setProductId(location.state.productId);
        
        if (location.state.discountPrice) {
            setFormData(prev => ({
                ...prev,
                discountAmount: location.state.discountPrice,
                totalAmount: (parseFloat(location.state.discountPrice) + 200).toString() 
            }));
        }
    }
}, [location.state, props]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };
      if (name === "discountAmount") {
        const productPrice = parseFloat(value) || 0;
        const tax = parseFloat(updatedData.taxAmount) || 0;
        const shipping = parseFloat(updatedData.shippingAmount) || 0;
        updatedData.totalAmount = (productPrice + tax + shipping).toString();
      }
      
      return updatedData;
    });
};

const calculateGrandTotal = () => {
    return formData.totalAmount || "0.00";
};

const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Find the selected user to get the ID
      const selectedCustomer = customers.find(c => c.user.name === formData.customerName);      
      if (!selectedCustomer) {
        alert("Please select a customer");
        setIsSubmitting(false);
        return;
      }
  
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        customer_id: selectedCustomer.id,
        created_by: selectedCustomer.user_id,
        order_date: formData.orderDate,
        status: formData.status,
        total_amount: formData.totalAmount,
        discount_amount: formData.discountAmount,
        tax_amount: formData.taxAmount,
        shipping_amount: formData.shippingAmount,
        grand_total: calculateGrandTotal(),
        payment_method: formData.paymentMethod,
        payment_status: formData.paymentStatus,
        shipping_address: formData.shippingAddress,
        notes: formData.notes,
        is_active: 1
      };
  
      // First API call to create the order
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
  
      toast.success("Thank you! Your order has been confirmed");
  
      // Prepare data for the second API call
      const orderItemData = {
        order_id: orderResult.id, 
        inventory_id: productId,
        quantity: formData.quantity,
        unit_price: 200, 
        discount_amount: formData.discountAmount,
        total_price: formData.totalAmount
      };
  
      // Second API call to create order items
      const orderItemResponse = await fetch("http://localhost:8000/api/order-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderItemData)
      });
  
      const orderItemResult = await orderItemResponse.json();
  
      if (!orderItemResponse.ok) {
        throw new Error(orderItemResult.message || "Failed to create order items");
      }
  
      toast.success("Order item has been added successfully");
      
      setTimeout(() => {
        navigate("/user-stock");
      }, 2000);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return; 
    
    setFormData(prev => ({
        ...prev,
        quantity: newQuantity
    }));
};

const incrementQuantity = () => {
    handleQuantityChange(formData.quantity + 1);
};

const decrementQuantity = () => {
    handleQuantityChange(formData.quantity - 1);
};

  return (
    <React.Fragment>
        <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
            {productId && (
        <div className="mb-3" style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            borderLeft: '4px solid #727cf5'
        }}>
            <strong>Ordering Product ID:</strong> {productId}
        </div>
    )}
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
              
              <Row className="mb-3" >
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
    //   id="status"
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
    <label htmlFor="quantity" className="col-md-2 col-form-label">
        Quantity
    </label>
    <div className="col-md-10">
        <div className="input-group" style={{ maxWidth: '200px' }}>
            <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={decrementQuantity}
                disabled={formData.quantity <= 1} // Disable minus button at quantity 1
            >
                -
            </button>
            <input
                type="number"
                className="form-control text-center"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                style={{ width: '60px' }}
            />
            <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={incrementQuantity}
            >
                +
            </button>
        </div>
    </div>
</Row>
              
              <Row className="mb-3">
                <label htmlFor="discountAmount" className="col-md-2 col-form-label">
                  Product Price
                </label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="number"
                    id="discountAmount"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
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
                    readOnly
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
                    readOnly
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
                    value={formData.totalAmount}
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
                    disabled={isSubmitting}
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

export default connect(null, { setBreadcrumbItems })(OrderNow);