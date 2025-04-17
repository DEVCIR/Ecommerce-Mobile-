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

function AddProducts({ props, setShowAddProduct }) {
  document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Products", link: "#" },
    { title: "Add Product", link: "#" },
  ];



  const [formData, setFormData] = useState({
    BrandName: "",
    Model: "",
    GB: "",
    Color: "",
    Network: "",
    Condition: "Brand New",
    SKU: "",
    SerialNo: "",
    IMEI: "",
    Description: "",
    Feature_ImageURL: null,
    AllImageURLs: [],
    SupplierID: "",
    DiscountType: "fixed",
    DiscountAmount: "",
    PurchasePrice: "",
    SellingPrice: "",
    Status: "Available",
    StockQuantity: "",
    PurchaseOrderNo: "",
    Barcode: "",
    Location: "",
  });

  const [formDataInventory, setFormDataInventory] = useState({
    StockQuantity: "",
    PurchaseOrderNo: "",
    Barcode: "",
    Location: "",
  });

  const [platformOptions, setPlatformOptions] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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

    fetchPlatforms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeInventory = (e) => {
    const { name, value } = e.target;
    setFormDataInventory({
      ...formDataInventory,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "Feature_ImageURL") {
      setFormData({
        ...formData,
        [name]: files[0], // Store the single file for feature image
      });
    } else if (name === "AllImageURLs") {
      setFormData({
        ...formData,
        [name]: Array.from(files), // Store multiple files for all images
      });
    }
  };

  const handlePlatformChange = (selectedOptions) => {
    setSelectedPlatforms(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === "AllImageURLs") {
        // Append each file in the AllImageURLs array
        formData[key].forEach((file, index) => {
          formDataToSend.append(`AllImageURLs[${index}]`, file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          'Authorization': "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        // Extract product_id from the response
        const productId = result.ProductID;

        try {
          const response = await fetch('http://127.0.0.1:8000/api/inventory', {
            method: 'POST',
            headers: {
               'Authorization': "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
               'Accept': "application/json",
               'content-type': "application/json"
            },
            body: JSON.stringify({
              "productID": productId,
              "stockQuantity": parseInt(formDataInventory.StockQuantity),
              "purchaseOrderNo": formDataInventory.PurchaseOrderNo,
              "barcode": formDataInventory.Barcode,
              "location": formDataInventory.Location,
            }),
          });
          console.log('Response URL:', response.url);
          if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
            alert('Inventory added successfully!');
            props.setViewToTable();
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }

        console.log("Product added successfully:", result);
        // alert("Product added successfully!");
        toast.success('Product added successfully')

        // Make a POST request for each selected platform
        for (const platform of selectedPlatforms) {
          await fetch("http://127.0.0.1:8000/api/product-and-platforms", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
            },
            body: JSON.stringify({
              'product_id': productId,
              'platform_id': platform.value,
              'is_sold': false, // Assuming default value for is_sold
            }),
          });
        }

        setShowAddProduct(false);
      } else {
        console.error("Error adding product:", result);
        // alert("Error adding product. Please try again.");
        toast.error('Error adding product. Please try again.')
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error('Error adding product. Please try again.')
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
                  <Label htmlFor="BrandName" className="col-md-2 col-form-label">
                    Brand Name
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="BrandName"
                      id="BrandName"
                      value={formData.BrandName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Model */}
                <Row className="mb-3">
                  <Label htmlFor="Model" className="col-md-2 col-form-label">
                    Model
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="Model"
                      id="Model"
                      value={formData.Model}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* GB */}
                <Row className="mb-3">
                  <Label htmlFor="GB" className="col-md-2 col-form-label">
                    GB
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="GB"
                      id="GB"
                      value={formData.GB}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Color */}
                <Row className="mb-3">
                  <Label htmlFor="Color" className="col-md-2 col-form-label">
                    Color
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="Color"
                      id="Color"
                      value={formData.Color}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Network */}
                <Row className="mb-3">
                  <Label htmlFor="Network" className="col-md-2 col-form-label">
                    Network
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="Network"
                      id="Network"
                      value={formData.Network}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Condition */}
                <Row className="mb-3">
                  <Label htmlFor="Condition" className="col-md-2 col-form-label">
                    Condition
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="Condition"
                      id="Condition"
                      value={formData.Condition}
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

                {/* SKU */}
                <Row className="mb-3">
                  <Label htmlFor="SKU" className="col-md-2 col-form-label">
                    SKU
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="SKU"
                      id="SKU"
                      value={formData.SKU}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Serial No */}
                <Row className="mb-3">
                  <Label htmlFor="SerialNo" className="col-md-2 col-form-label">
                    Serial No
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="SerialNo"
                      id="SerialNo"
                      value={formData.SerialNo}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* IMEI */}
                <Row className="mb-3">
                  <Label htmlFor="IMEI" className="col-md-2 col-form-label">
                    IMEI
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="IMEI"
                      id="IMEI"
                      value={formData.IMEI}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Description */}
                <Row className="mb-3">
                  <Label htmlFor="Description" className="col-md-2 col-form-label">
                    Description
                  </Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="Description"
                      id="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Feature Image */}
                <Row className="mb-3">
                  <Label htmlFor="Feature_ImageURL" className="col-md-2 col-form-label">
                    Feature Image
                  </Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      name="Feature_ImageURL"
                      id="Feature_ImageURL"
                      onChange={handleFileChange}
                      required
                    />
                  </Col>
                </Row>

                {/* All Images */}
                <Row className="mb-3">
                  <Label htmlFor="AllImageURLs" className="col-md-2 col-form-label">
                    All Images
                  </Label>
                  <Col md={10}>
                    <Input
                      type="file"
                      name="AllImageURLs"
                      id="AllImageURLs"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Col>
                </Row>

                {/* Supplier ID */}
                <Row className="mb-3">
                  <Label htmlFor="SupplierID" className="col-md-2 col-form-label">
                    Supplier ID
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="SupplierID"
                      id="SupplierID"
                      value={formData.SupplierID}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Discount Type */}
                <Row className="mb-3">
                  <Label htmlFor="DiscountType" className="col-md-2 col-form-label">
                    Discount Type
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="DiscountType"
                      id="DiscountType"
                      value={formData.DiscountType}
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
                  <Label htmlFor="DiscountAmount" className="col-md-2 col-form-label">
                    Discount Amount
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="DiscountAmount"
                      id="DiscountAmount"
                      value={formData.DiscountAmount}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Purchase Price */}
                <Row className="mb-3">
                  <Label htmlFor="PurchasePrice" className="col-md-2 col-form-label">
                    Purchase Price
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="PurchasePrice"
                      id="PurchasePrice"
                      value={formData.PurchasePrice}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Selling Price */}
                <Row className="mb-3">
                  <Label htmlFor="SellingPrice" className="col-md-2 col-form-label">
                    Selling Price
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="SellingPrice"
                      id="SellingPrice"
                      value={formData.SellingPrice}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Status */}
                <Row className="mb-3">
                  <Label htmlFor="Status" className="col-md-2 col-form-label">
                    Status
                  </Label>
                  <Col md={10}>
                    <Input
                      type="select"
                      name="Status"
                      id="Status"
                      value={formData.Status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Returned">Returned</option>
                    </Input>
                  </Col>
                </Row>

                {/* Stock Quantity */}
                <Row className="mb-3">
                  <Label htmlFor="StockQuantity" className="col-md-2 col-form-label">
                    Stock Quantity
                  </Label>
                  <Col md={10}>
                    <Input
                      type="number"
                      name="StockQuantity"
                      id="StockQuantity"
                      value={formDataInventory.StockQuantity}
                      onChange={handleChangeInventory}
                      required
                    />
                  </Col>
                </Row>

                {/* Purchase Order No */}
                <Row className="mb-3">
                  <Label htmlFor="PurchaseOrderNo" className="col-md-2 col-form-label">
                    Purchase Order No
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="PurchaseOrderNo"
                      id="PurchaseOrderNo"
                      value={formDataInventory.PurchaseOrderNo}
                      onChange={handleChangeInventory}
                      required
                    />
                  </Col>
                </Row>

                {/* Barcode */}
                <Row className="mb-3">
                  <Label htmlFor="Barcode" className="col-md-2 col-form-label">
                    Barcode
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="Barcode"
                      id="Barcode"
                      value={formDataInventory.Barcode}
                      onChange={handleChangeInventory}
                      required
                    />
                  </Col>
                </Row>

                {/* Location */}
                <Row className="mb-3">
                  <Label htmlFor="Location" className="col-md-2 col-form-label">
                    Location
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="Location"
                      id="Location"
                      value={formDataInventory.Location}
                      onChange={handleChangeInventory}
                      required
                    />
                  </Col>
                </Row>

                {/* Platform Multi-Select */}
                <Row className="mb-3">
                  <Label htmlFor="platforms" className="col-md-2 col-form-label">
                    Platforms
                  </Label>
                  <Col md={10}>
                    <Select
                      isMulti
                      name="platforms"
                      options={platformOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handlePlatformChange}
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

export default connect(null, { setBreadcrumbItems })(AddProducts);