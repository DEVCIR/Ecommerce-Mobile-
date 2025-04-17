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
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import Select from 'react-select';
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AddInventory({ props, onInventoryAdded }) {
  const navigate = useNavigate()
  document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Products", link: "#" },
    { title: "Add Product", link: "#" },
  ];

//  // Brand validation
//  'brand_description' => 'nullable|string',

//  // Inventory validation
//  'date_purchased' => 'nullable|date',
//  'date_sold' => 'nullable|date',
//  'notes' => 'nullable|string',

  const [formData, setFormData] = useState({
    brand_name: "",
    model_name: "",
    storage_gb: "",
    color: "",
    network_type: "",
    condition: "Brand New",
    sku: "",
    serial_no: "",
    imei: "",
    product_description: "",
    feature_imageUrl: null,
    all_imageUrls: [],
    supplier_id: "",
    discount_type: "fixed",
    discount_price: "",
    purchase_price: "",
    selling_price: "",
    stock_status: "In Stock",
    quantity: "",
    purchase_order_no: "",
    location: "",
    wholesale_price: "",
  });


  const [platformOptions, setPlatformOptions] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/listing-platforms",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
            },
          }
        );
        const data = await response.json();
        const options = data.data.map(platform => ({
          value: platform.id,
          label: platform.platform_name
        }));
        setPlatformOptions(options);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/suppliers");
        const data = await response.json();
        const options = data.data.data.map(supplier => ({
          value: supplier.id,
          label: supplier.user.name
        }));
        setSupplierOptions(options);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchPlatforms();
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "feature_imageUrl") {
      setFormData({
        ...formData,
        [name]: files[0], // Store the single file for feature image
      });
    } else if (name === "all_imageUrls") {
      setFormData({
        ...formData,
        [name]: Array.from(files), // Store multiple files for all images
      });
    }
  };

  const handlePlatformChange = (selectedOptions) => {
    setSelectedPlatforms(selectedOptions);
  };

  // Generate barcode dynamically
  const generateBarcode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Generate and append barcode
    const generatedBarcode = generateBarcode();
    
    for (const key in formData) {
      if (key === "all_imageUrls") {
        // Append each file in the all_imageUrls array
        formData[key].forEach((file, index) => {
          formDataToSend.append(`all_imageUrls[${index}]`, file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    formDataToSend.append('barcode', generatedBarcode);
    console.log("BArcode: ", generatedBarcode)

    try {
      const response = await fetch("http://localhost:8000/api/inventory", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      console.log('Result', result)
      toast.success('Inventory Added Successfully');
      
      setTimeout(() => {
        if (typeof onInventoryAdded === 'function') {
          onInventoryAdded();
        } else {
          console.error("onInventoryAdded is not a function");
        }
      }, 2000);

    } catch (error) {
      console.error("Error adding inventory:", error);
      toast.error('Error adding inventory. Please try again.')
      // alert("Error adding product. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Add Product</CardTitle>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Label htmlFor="brand_name" className="col-md-2 col-form-label">
                    Brand Name
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="brand_name"
                      id="brand_name"
                      value={formData.brand_name}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* model_name */}
                <Row className="mb-3">
                  <Label htmlFor="model_name" className="col-md-2 col-form-label">
                    Model
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="model_name"
                      id="model_name"
                      value={formData.model_name}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* storage_gb */}
                <Row className="mb-3">
                  <Label htmlFor="storage_gb" className="col-md-2 col-form-label">
                    Storage
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="storage_gb"
                      id="storage_gb"
                      value={formData.storage_gb}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Color */}
                <Row className="mb-3">
                  <Label htmlFor="color" className="col-md-2 col-form-label">
                    Color
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="color"
                      id="color"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Network */}
                <Row className="mb-3">
                  <Label htmlFor="network_type" className="col-md-2 col-form-label">
                    Network Type
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="network_type"
                      id="network_type"
                      value={formData.network_type}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label htmlFor="category" className="col-md-2 col-form-label">
                    Category
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Condition */}
                <Row className="mb-3">
                  <Label htmlFor="condition" className="col-md-2 col-form-label">
                    Condition
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="condition"
                      id="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="14 Days">14 Days</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Grade C">Grade C</option>
                      <option value="Grade D">Grade D</option>
                      <option value="Grade E">Grade E</option>
                    </Input>
                  </Col>
                </Row>

                {/* sku */}
                <Row className="mb-3">
                  <Label htmlFor="sku" className="col-md-2 col-form-label">
                    SKU
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="sku"
                      id="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Serial No */}
                <Row className="mb-3">
                  <Label htmlFor="serial_no" className="col-md-2 col-form-label">
                    Serial No
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="serial_no"
                      id="serial_no"
                      value={formData.serial_no}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* imei */}
                <Row className="mb-3">
                  <Label htmlFor="imei" className="col-md-2 col-form-label">
                    IMEI
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="imei"
                      id="imei"
                      value={formData.imei}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Description */}
                <Row className="mb-3">
                  <Label htmlFor="product_description" className="col-md-2 col-form-label">
                    Product Description
                  </Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="product_description"
                      id="product_description"
                      value={formData.product_description}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Feature Image */}
                <Row className="mb-3">
                  <Label htmlFor="feature_imageUrl" className="col-md-2 col-form-label">
                    Feature Image
                  </Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      name="feature_imageUrl"
                      id="feature_imageUrl"
                      onChange={handleFileChange}
                      // required
                    />
                  </Col>
                </Row>

                {/* All Images */}
                <Row className="mb-3">
                  <Label htmlFor="all_imageUrls" className="col-md-2 col-form-label">
                    All Images
                  </Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      name="all_imageUrls"
                      id="all_imageUrls"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Col>
                </Row>

                {/* Supplier ID */}
                <Row className="mb-3">
                  <Label htmlFor="supplier_id" className="col-md-2 col-form-label">
                    Supplier ID
                  </Label>
                  <Col md={10}>
                    <Select
                      options={supplierOptions}
                      onChange={(selectedOption) => setFormData({ ...formData, supplier_id: selectedOption.value })}
                      required
                    />
                  </Col>
                </Row>

                {/* Discount Type */}
                <Row className="mb-3">
                  <Label htmlFor="discount_type" className="col-md-2 col-form-label">
                    Discount Type
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="discount_type"
                      id="discount_type"
                      value={formData.discount_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">Percentage</option>
                    </Input>
                  </Col>
                </Row>

                {/* Discount Amount */}
                <Row className="mb-3">
                  <Label htmlFor="discount_price" className="col-md-2 col-form-label">
                    Discount Amount
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="discount_price"
                      id="discount_price"
                      value={formData.discount_price}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Label htmlFor="wholesale_price" className="col-md-2 col-form-label">
                    Wholesale Price
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="wholesale_price"
                      id="wholesale_price"
                      value={formData.wholesale_price}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Purchase Price */}
                <Row className="mb-3">
                  <Label htmlFor="purchase_price" className="col-md-2 col-form-label">
                    Purchase Price
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="purchase_price"
                      id="purchase_price"
                      value={formData.purchase_price}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Selling Price */}
                <Row className="mb-3">
                  <Label htmlFor="selling_price" className="col-md-2 col-form-label">
                    Selling Price
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="selling_price"
                      id="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* stock_status */}
                <Row className="mb-3">
                  <Label htmlFor="stock_status" className="col-md-2 col-form-label">
                    Status
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="stock_status"
                      id="stock_status"
                      value={formData.stock_status}
                      onChange={handleChange}
                      required
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Sold">Sold</option>
                      <option value="Returned">Returned</option>
                      <option value="Defective">Returned</option>
                    </Input>
                  </Col>
                </Row>

                {/* Stock Quantity */}
                <Row className="mb-3">
                  <Label htmlFor="quantity" className="col-md-2 col-form-label">
                    Stock Quantity
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Purchase Order No */}
                {/* <Row className="mb-3">
                  <Label htmlFor="purchase_order_no" className="col-md-2 col-form-label">
                    Purchase Order No
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="purchase_order_no"
                      id="purchase_order_no"
                      value={formData.purchase_order_no}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row> */}

                {/* barcode */}
                {/* <Row className="mb-3">
                  <Label htmlFor="barcode" className="col-md-2 col-form-label">
                    Barcode
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="barcode"
                      id="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row> */}

                {/* location */}
                <Row className="mb-3">
                  <Label htmlFor="location" className="col-md-2 col-form-label">
                    Location
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Submit Button */}
                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary">
                      Add Product
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
};

export default connect(null, { setBreadcrumbItems })(AddInventory);