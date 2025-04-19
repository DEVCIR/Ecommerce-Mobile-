import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap"
import { Toaster, toast } from "sonner";


const GenerateCreditNote = ( customerData, selectedItems, onBack ) => {
 
  function generateRMA() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RMA-${date}-${random}`;
  }
  
  const [allData,setAllData]=useState('')
  const [invoiceNumber,setInvoiceNumber]=useState('')
  const [customerID,setCustomerID]=useState('')
  const [customerName,setCustomerName]=useState('')
  const [customerEmail,setCustomerEmail]=useState('')
  const [orderId,setOrderId]=useState('')
  const [rmasNumber, setRmasNumber] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [generalReason,setGeneralReason]= useState('');

  useEffect(()=>{
    console.log("dataaaa",customerData)
    setAllData(customerData)
  },[customerData])

  useEffect(() => {
    if (allData?.selectedItems && allData.selectedItems.length > 0) {
      const selectedItems = allData.selectedItems;
      setSelectedProducts(selectedItems); 
      console.log("Selected Items: ", selectedItems);
    }
  }, [allData]);

useEffect(() => {
  if (allData?.customerData && allData.customerData.length > 0) {
    const customer = allData.customerData[0];
    console.log("Getting Customer Data", customer.invoice_number);
    setInvoiceNumber(customer.invoice_number);
    setCustomerID(customer.customer_id);
    setCustomerName(customer.customer?.user?.name);
    setCustomerEmail(customer.customer?.user?.email);
    setOrderId(customer.order?.id)
  }
}, [allData]);

useEffect(() => {
  if (invoiceNumber && customerID && orderId) {
    const generatedRMAS = generateRMA();
    setRmasNumber(generatedRMAS);
  }
}, [invoiceNumber, customerID, orderId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("1", invoiceNumber);
      console.log("2", customerID);
      console.log("3", customerName);
      console.log("4", customerEmail);
      console.log('5',orderId)
    }, 1000); 
    return () => clearTimeout(timer); 
  }, [invoiceNumber, customerID, customerName,orderId]);

  const handleCreateRMAS = async () => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
  
      const rmasData = {
        rma_number: rmasNumber,
        customer_id: customerID,
        order_id: orderId,
        request_date: currentDate,
        status: "Requested",
        reason: generalReason || "The user has not provided any comments",
        resolved_by: 13,
        resolved_date: currentDate,
        is_active: 0
      };
  
     
      const rmasResponse = await fetch("http://localhost:8000/api/rmas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rmasData)
      });
  
      if (!rmasResponse.ok) {
        throw new Error(`HTTP error! status: ${rmasResponse.status}`);
      }
  
      const rmasResult = await rmasResponse.json();
      const rmaId = rmasResult?.id; 
  
      console.log("RMAS created successfully:", rmasResult);
  
    
      if (rmaId) {
        for (const product of selectedProducts) {
          const rmaItemData = {
            rma_id: rmaId,
            inventory_id: product.inventory_id,
            quantity: product.quantity,
            reason: product.reason || "No reason provided",
            is_active: 0
          };
  
          const itemResponse = await fetch("http://localhost:8000/api/rma-items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(rmaItemData)
          });
  
          if (!itemResponse.ok) {
            console.error(`Failed to create rma item for inventory_id: ${product.inventory_id}`);
          } else {
            const itemResult = await itemResponse.json();
            console.log(`RMA item created successfully:`, itemResult);
          }
        }
      }
      
      toast.success("RMAS and associated items created successfully!");
      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Error creating RMAS or RMA items:", error);
      toast.error("An error occurred while creating RMAS.")
    }
  };
  



  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Generate Credit Note</CardTitle>
              <p className="card-title-desc">
                Fill in the details below to generate a credit note.
              </p>

              <Form>
                <Row className="mb-3">
                  <Label htmlFor="rmasNumber" className="col-md-2 col-form-label">
                    RMAS Number
                  </Label>
                  <div className="col-md-10">
                    <Input
                      className="form-control"
                      type="text"
                      id="rmasNumber"
                      name="rmasNumber"
                      value={rmasNumber}
                      readOnly
                    />
                  </div>
                </Row>

                <Row className="mb-3">
                  <Label htmlFor="invoiceNumber" className="col-md-2 col-form-label">
                    Invoice Number
                  </Label>
                  <div className="col-md-10">
                    <Input
                      className="form-control"
                      type="text"
                      id="invoiceNumber"
                      name="invoiceNumber"
                      value={invoiceNumber}
                      readOnly
                    />
                  </div>
                </Row>

                <Row className="mb-3">
                  <Label htmlFor="customerName" className="col-md-2 col-form-label">
                    Customer Name
                  </Label>
                  <div className="col-md-10">
                    <Input
                      className="form-control"
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={customerName}
                      readOnly
                    />
                  </div>
                </Row>

                <Row className="mb-3">
                  <Label htmlFor="customerEmail" className="col-md-2 col-form-label">
                    Customer Email
                  </Label>
                  <div className="col-md-10">
                    <Input
                      className="form-control"
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={customerEmail}
                      readOnly
                    />
                  </div>
                </Row>

                <Row className="mb-3">
                  <Label htmlFor="reason" className="col-md-2 col-form-label">
                    Comments
                  </Label>
                  <div className="col-md-10">
                    <Input
                      className="form-control"
                      type="textarea"
                      id="reason"
                      name="reason"
                      placeholder="Enter general reason for credit note"
                      rows="3"
                      onChange={(e)=>{setGeneralReason(e.target.value)}}

                    />
                  </div>
                </Row>






{selectedProducts.map((item, index) => (
  <React.Fragment key={index}>
    <div className="mb-4 p-3 border rounded shadow-sm ">
      <h5 className="mb-3 text-primary">Product {index + 1}</h5>

      <Row className="mb-3">
        <Label htmlFor={`product-${index}`} className="col-md-2 col-form-label fw-semibold">
          Product Name
        </Label>
        <div className="col-md-10">
          <Input
            className="form-control"
            type="textarea"
            id={`product-${index}`}
            name={`product-${index}`}
            value={item.product_name}
            readOnly
            rows="1"
            style={{ resize: "none", backgroundColor: "#f8f9fa" }}
          />
        </div>
      </Row>

      <Row className="mb-3">
        <Label htmlFor={`quantity-${index}`} className="col-md-2 col-form-label fw-semibold">
          Quantity
        </Label>
        <div className="col-md-10">
          <Input
            className="form-control"
            type="textarea"
            id={`quantity-${index}`}
            name={`quantity-${index}`}
            value={item.quantity}
            readOnly
            rows="1"
            style={{ resize: "none", backgroundColor: "#f8f9fa" }}
          />
        </div>
      </Row>


         <Row className="mb-3">
        <Label htmlFor={`total_price-${index}`} className="col-md-2 col-form-label fw-semibold">
         Total Price
        </Label>
        <div className="col-md-10">
          <Input
            className="form-control"
            type="textarea"
            id={`total_price-${index}`}
            name={`total_price-${index}`}
            value={item.total_price}
            readOnly
            rows="1"
            style={{ resize: "none", backgroundColor: "#f8f9fa" }}
          />
        </div>
      </Row>

      <Row className="mb-3">
        <Label htmlFor={`reason-${index}`} className="col-md-2 col-form-label fw-semibold">
          Reason
        </Label>
        <div className="col-md-10">
          <Input
            className="form-control"
            type="textarea"
            id={`reason-${index}`}
            name={`reason-${index}`}
            value={item.reason || ""}
            onChange={(e) => {
              const newProducts = [...selectedProducts];
              newProducts[index].reason = e.target.value;
              setSelectedProducts(newProducts);
            }}
            placeholder="Enter reason for refund"
            rows="2"
            style={{ resize: "none" }}
          />
        </div>
      </Row>
    </div>
  </React.Fragment>
))}




              </Form>



              <div className="d-flex justify-content-end mt-4">
                <Button
                  color="primary"
                  className="me-2"
                  onClick={onBack}
                >
                  Back
                </Button>
                <Button
                  color="success"
                  onClick={handleCreateRMAS}
                >
                  Create RMAS
                </Button>
              </div>


            </CardBody>
          </Card>
        </Col>
      </Row>


    </React.Fragment>
  )
}

export default GenerateCreditNote;