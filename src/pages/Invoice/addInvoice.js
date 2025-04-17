import React from "react";
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
import { Toaster } from "sonner";

function AddInvoice({ onBackClick, setBreadcrumbItems }) {  // Added onBackClick prop
  document.title = "Add Product | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Products", link: "#" },
    { title: "Add Product", link: "#" },
  ];

  // Initialize breadcrumbs (you might want to move this to useEffect)
  setBreadcrumbItems("Add Product", breadcrumbItems);

  return (
    <React.Fragment>
      <Toaster position="top-right" richColors />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle className="h4">Add Product</CardTitle>
                <Button 
                  color="secondary" 
                  onClick={onBackClick}
                  style={{ marginBottom: '20px' }}
                >
                  Back to Invoice Table
                </Button>
              </div>
              <Form>
                {/* Rest of your form remains the same */}
                <Row className="mb-3">
                  <Label htmlFor="brand_name" className="col-md-2 col-form-label">
                    Brand Name
                  </Label>
                  <Col md={10}>
                    <Input
                      type="text"
                      name="brand_name"
                      id="brand_name"
                      required
                    />
                  </Col>
                </Row>

                {/* ... rest of your form fields ... */}

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary">
                      Add Invoice
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

export default connect(null, { setBreadcrumbItems })(AddInvoice);