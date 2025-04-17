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

function LiveInventory({ props, setShowAddProduct }) {
    const navigate = useNavigate()
    document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

    const breadcrumbItems = [
        { title: "Lexa", link: "#" },
        { title: "Products", link: "#" },
        { title: "Add Product", link: "#" },
    ];



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
        barcode: "",
        location: "",
    });

    const [formDataInventory, setFormDataInventory] = useState({
        quantity: "",
        purchase_order_no: "",
        barcode: "",
        location: "",
    });

    const [platformOptions, setPlatformOptions] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [brandOptions, setBrandOptions] = useState([]);
    const [imgUrls, setImgUrls] = useState([])

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

        const fetchBrands = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/brands");
                const data = await response.json();
                if (data.success) {
                    const options = data.data.data.map(brand => ({
                        value: brand.id,
                        label: brand.brand_name
                    }));
                    setBrandOptions(options);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        fetchPlatforms();
        fetchBrands();
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

    const handleShowMoreFields = () => {
        setShowAdditionalFields(true);
    };

    //   const handleSearch = async () => {
    //     const { brand_name, model_name } = formData;
    //     if (brand_name && model_name) {
    //       try {

    //         const response = await fetch(`http://127.0.0.1:5000/scrape-phone?name=${brand_name} ${model_name}`);
    //         const data = await response.json();

    //         // Update formData with the fetched data
    //         setFormData(prevData => ({
    //           ...prevData,
    //         }));

    //         // Handle images if needed
    //         if (data.ImageGallery) {
    //           setFormData(prevData => ({
    //             ...prevData,
    //             feature_imageUrl: data.ImageGallery[0],
    //             all_imageUrls: data.ImageGallery.map(url => ({
    //               url: url 
    //             }))
    //           }));
    //         }

    //         setShowAdditionalFields(true)

    //       } catch (error) {
    //         console.error("Error fetching phone specs:", error);
    //       }
    //     } else {
    //       toast.error('Please enter both Brand Name and model_name');
    //     }
    //   };

    //   const generateBarcode = () => {
    //     return Math.floor(100000 + Math.random() * 900000).toString(); 
    //   };

    //   const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formDataToSend = new FormData();

    //     // Generate and append barcode
    //     const generatedBarcode = generateBarcode();

    //     for (const key in formData) {
    //       formDataToSend.append(key, formData[key]);
    //     }


    //     formDataToSend.append('barcode', generatedBarcode);
    //     console.log("Barcode: ", generatedBarcode);
    //     console.log("Data To Upload: ", formData);

    //     try {
    //       const response = await fetch("http://localhost:8000/api/inventory", {
    //         method: "POST",
    //         body: formDataToSend
    //       });

    //       const result = await response.json();
    //       console.log('Result', result);
    //     } catch (error) {
    //       console.error("Error adding inventory:", error);
    //       toast.error('Error adding inventory. Please try again.');
    //     }
    //   };


    const handleSearch = async () => {
        const { brand_name, model_name } = formData;
        if (brand_name && model_name) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/scrape-phone?name=${brand_name} ${model_name}`);
                const data = await response.json();

                // Get image URLs
                const imageUrls = data.ImageGallery || [];
                setImgUrls(imageUrls)

                // Download images via Flask proxy and convert to File objects
                const imageFiles = await Promise.all(
                    imageUrls.map(async (url, index) => {
                        const proxyUrl = `http://127.0.0.1:5000/download-image?url=${encodeURIComponent(url)}`;
                        const imageResponse = await fetch(proxyUrl);
                        const blob = await imageResponse.blob();
                        // const ext = blob.type.split("/")[1] || "jpg";
                        const ext = "jpg";

                        return new File([blob], `image_${index}.${ext}`, { type: blob.type });
                    })
                );

                setFormData(prevData => ({
                    ...prevData,
                    feature_imageUrl: imageFiles[0],
                    all_imageUrls: imageFiles
                }));

                setShowAdditionalFields(true);
            } catch (error) {
                console.error("Error fetching phone specs:", error);
                toast.error("Error fetching phone specs");
            }
        } else {
            toast.error("Please enter both Brand Name and Model Name");
        }
    };

    const generateBarcode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        const generatedBarcode = generateBarcode();
        formDataToSend.append("barcode", generatedBarcode);

        // Append other form fields except image keys
        for (const key in formData) {
            if (key !== "feature_imageUrl" && key !== "all_imageUrls") {
                formDataToSend.append(key, formData[key]);
            }
        }

        // ✅ Correct key name for feature image
        if (formData.feature_imageUrl instanceof File) {
            formDataToSend.append("feature_imageUrl", formData.feature_imageUrl);
        }

        // ✅ Correct key name for additional images
        if (Array.isArray(formData.all_imageUrls)) {
            formData.all_imageUrls.forEach((file) => {
                formDataToSend.append("all_imageUrls[]", file);
            });
        }

        console.log("Barcode: ", generatedBarcode);

        try {
            const response = await fetch("http://localhost:8000/api/inventory", {
                method: "POST",
                body: formDataToSend,
            });

            // Check if the response status is not 200 or 201
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Result", result);
            
            toast.success("Inventory added successfully!");
            navigate('/inventory')
        } catch (error) {
            console.error("Error adding inventory:", error);
            toast.error("Error adding inventory. Please try again.");
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
                                        {/* Dropdown for selectable options */}
                                        <Input
                                            type="select"
                                            name="brand_select"
                                            id="brand_select"
                                            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                        >
                                            <option value="">Select a brand</option>
                                            {brandOptions.map(option => (
                                                <option key={option.value} value={option.label}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>

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

                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button type="button" color="secondary" onClick={handleSearch}>
                                            Search
                                        </Button>
                                    </Col>
                                </Row>


                                {showAdditionalFields && (
                                    <>
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

                                        <Row className="mb-3">
                                            <Label htmlFor="product_description" className="col-md-2 col-form-label">
                                                Description
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
                                        {/* 
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
                          
                        />
                      </Col>
                    </Row>

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
                    </Row> */}

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

                                        <Row className="mb-3">
                                            <Label htmlFor="stock_status" className="col-md-2 col-form-label">
                                                stock_status
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
                                                    <option value="Available">Available</option>
                                                    <option value="Sold">Sold</option>
                                                    <option value="Returned">Returned</option>
                                                </Input>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Label htmlFor="quantity" className="col-md-2 col-form-label">
                                                Stock Quantity
                                            </Label>
                                            <Col md={10}>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    id="quantity"
                                                    value={formDataInventory.quantity}
                                                    onChange={handleChangeInventory}
                                                    required
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Label htmlFor="purchase_order_no" className="col-md-2 col-form-label">
                                                Purchase Order No
                                            </Label>
                                            <Col md={10}>
                                                <Input
                                                    type="text"
                                                    name="purchase_order_no"
                                                    id="purchase_order_no"
                                                    value={formDataInventory.purchase_order_no}
                                                    onChange={handleChangeInventory}
                                                    required
                                                />
                                            </Col>
                                        </Row>

                                        {/* <Row className="mb-3">
                      <Label htmlFor="barcode" className="col-md-2 col-form-label">
                        Barcode
                      </Label>
                      <Col md={10}>
                        <Input
                          type="text"
                          name="barcode"
                          id="barcode"
                          value={formDataInventory.barcode}
                          onChange={handleChangeInventory}
                          required
                        />
                      </Col>
                    </Row> */}

                                        <Row className="mb-3">
                                            <Label htmlFor="location" className="col-md-2 col-form-label">
                                                Location
                                            </Label>
                                            <Col md={10}>
                                                <Input
                                                    type="text"
                                                    name="location"
                                                    id="location"
                                                    value={formDataInventory.location}
                                                    onChange={handleChangeInventory}
                                                    required
                                                />
                                            </Col>
                                        </Row>

                                        {/* <Row className="mb-3">
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
                    </Row> */}
                                    </>
                                )}
                                {/* Display fetched images */}
                                {formData.all_imageUrls.length > 0 && (
                                    <Row className="mb-3">
                                        <Col>
                                            <h5>Scrapped Images:</h5>
                                            <div className="image-gallery">
                                                {imgUrls.map((image, index) => (
                                                    // image.url ? (
                                                        <img key={index} src={image} alt={`Fetched Image ${index + 1}`} style={{ width: '100px', margin: '5px' }} />
                                                    // ) : (
                                                    //     <div key={index} style={{ width: '100px', margin: '5px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                                                    //         Image not available
                                                    //     </div>
                                                    // )
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>
                                )}

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

export default connect(null, { setBreadcrumbItems })(LiveInventory);