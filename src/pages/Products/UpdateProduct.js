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
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {BASE_URL} from '../../Service';

const UpdateProduct = (props) => {
  document.title = "Update Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const { id } = useParams();
  const navigate = useNavigate()


  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Products", link: "#" },
    { title: "Update Product", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Update Product", breadcrumbItems);
    fetchProduct();
  }, []);

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
    description: "",
    feature_imageUrl: null,
    all_imageUrls: [],
    supplier_id: "",
    discount_type: "fixed",
    discount_price: "",
    purchase_price: "",
    selling_price: "",
    stock_status: "Available",
  });

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}/inventory?id=${id}`, {
        headers: {
          "content-type":"application/json",
          // "Authorization": "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478"
        }
      });
      const data = await response.json();
      setFormData({
        brand_name: data.data.data[0].variant.product.brand.brand_name,
        model_name: data.data.data[0].variant.product.model_name,
        storage_gb: data.data.data[0].variant.storage_gb,
        color: data.data.data[0].variant.color,
        network_type: data.data.data[0].variant.network_type,
        condition: data.data.data[0].condition,
        sku: data.data.data[0].variant.product.sku,
        serial_no: data.data.data[0].serial_no,
        imei: data.data.data[0].imei,
        description: data.data.data[0].variant.product.description,
        feature_imageUrl: data.data.data[0].variant.product.feature_imageUrl,
        all_imageUrls: data.data.data[0].variant.product.all_imageUrls,
        supplier_id: data.data.data[0].supplier_id,
        discount_type: data.data.data[0].discount_type,
        discount_price: data.data.data[0].discount_price,
        purchase_price: data.data.data[0].purchase_price,
        selling_price: data.data.data[0].selling_price,
        stock_status: data.data.data[0].stock_status,
      });
      console.log('mmm', data.data.data[0]);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

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
        [name]: files[0],
      });
    } else if (name === "all_imageUrls") {
      setFormData({
        ...formData,
        [name]: Array.from(files),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a copy of formData and remove supplier
    // console.log("Updated ", formData)
    let filteredFormData = { ...formData };
    if (typeof filteredFormData.feature_imageUrl === 'string' && 
        filteredFormData.feature_imageUrl.startsWith(`${BASE_URL}/storage/images/products/`)) {
        delete filteredFormData.feature_imageUrl;
    }
    if (Array.isArray(filteredFormData.all_imageUrls) && 
        filteredFormData.all_imageUrls.some(url => typeof url === 'string' && url.startsWith(`${BASE_URL}/storage/images/products/`))) {
        delete filteredFormData.all_imageUrls;
    }
    console.log("ASDQe", filteredFormData)
    let hasImages = filteredFormData.feature_imageUrl || filteredFormData.all_imageUrls;
    let requestBody;
    let headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
    };

    if (hasImages) {
      requestBody = new FormData();
      for (const key in filteredFormData) {
        if (key === "all_imageUrls") {
          filteredFormData[key].forEach((file, index) => {
            requestBody.append(`all_imageUrls[${index}]`, file);
          });
        } else {
          requestBody.append(key, filteredFormData[key]);
        }
      }
    } else {
      headers["Content-Type"] = "application/json";
      requestBody = JSON.stringify(filteredFormData);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/inventory/${id}`, {
        method: "POST",
        headers: hasImages ? { Authorization: headers.Authorization } : headers,
        body: requestBody,
      });

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        console.log("Product updated successfully:", result);
        toast.success("Product has been updated sucessfully", {
          duration: 2000,
        })
        setTimeout(() => {
          navigate('/products');
        }, 2000); 
        // navigate("/products");
      } catch (jsonError) {
        console.error("Invalid JSON response:", text);
        toast.error("Product while updating Product. Please try again.")
        // alert("Unexpected server response. Check the console for details.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Product while updating Product. Please try again.")
      // alert("Error updating product. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Toaster position="top-right" richColors />
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Update Product</CardTitle>
              <Form onSubmit={handleSubmit}>
                {/* Brand Name */}
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
                    GB
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

                {/* color */}
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

                {/* network_type */}
                <Row className="mb-3">
                  <Label htmlFor="network_type" className="col-md-2 col-form-label">
                    Network
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

                {/* condition */}
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
                  <Label htmlFor="description" className="col-md-2 col-form-label">
                    Description
                  </Label>
                  <Col md={10}>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Feature Image */}
                {/* {console.log("314", formData.feature_imageUrl)} */}

                <Row className="mb-3">
                  <Label htmlFor="feature_imageUrl" className="col-md-2 col-form-label">
                    Feature Image
                  </Label>
                  <Col md={10}>
                    <img
                      src={formData.feature_imageUrl}
                      alt="Selected Preview"
                      className="w-48 h-48 object-cover rounded"
                    />
                    <Input
                      type="file"
                      name="feature_imageUrl"
                      id="feature_imageUrl"
                      //    value={formData.feature_imageUrl}
                      onChange={handleFileChange}
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
                    <Input
                      type="text"
                      name="supplier_id"
                      id="supplier_id"
                      value={formData.supplier_id}
                      onChange={handleChange}
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
                    </Input>
                  </Col>
                </Row>

                {/* Submit Button */}
                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary">
                      Update Product
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

export default connect(null, { setBreadcrumbItems })(UpdateProduct);