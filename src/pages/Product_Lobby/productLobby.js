import React, { useEffect, useState, useMemo } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import Marquee from "react-fast-marquee";
import { useParams } from "react-router-dom";

const ProductLobby = (props) => {
  const { id } = useParams();
  document.title = "Responsive Table | Lexa - Responsive Bootstrap 5 Admin Dashboard";

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Tables", link: "#" },
    { title: "Responsive Table", link: "#" },
  ]

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tempSoldStatus, setTempSoldStatus] = useState(null);

  // Calculate products that are sold on some platforms but not all
  const productsToRemove = useMemo(() => {
    const productMap = {};
    console.log("DATA", data, id)
    data.filter(item => item.product_id === parseInt(id)).forEach(item => {
      if (!item.product) return;
      const productId = item.product.id;
      if (!productMap[productId]) {
        productMap[productId] = {
          name: item.product.BrandName,
          platforms: [],
          anySold: false,
          allSold: true
        };
      }

      productMap[productId].platforms.push({
        id: item.platform?.id,
        name: item.platform?.platform_name,
        isSold: item.is_sold
      });

      if (item.is_sold) {
        productMap[productId].anySold = true;
      } else {
        productMap[productId].allSold = false;
      }
    });
    // Filter products that have some sold but not all
    return Object.values(productMap)
      .filter(product => product.anySold && !product.allSold)
      .map(product => ({
        id: product.name,
        name: product.name,
        unsoldPlatforms: product.platforms
          .filter(p => !p.isSold)
          .map(p => p.name)
          .join(', ')
      }));
  }, [data]);

  useEffect(() => {
    props.setBreadcrumbItems('Responsive Table', breadcrumbItems);

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/product-and-platforms', {
          headers: {
            'Authorization': "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props]);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setTempSoldStatus(item.is_sold);
  };

  const handleSoldStatusChange = (e) => {
    setTempSoldStatus(parseInt(e.target.value));
  };

  const handleSave = async (itemId) => {
    try {
      // Update local state optimistically
      const updatedData = data.map(item =>
        item.id === itemId ? { ...item, is_sold: tempSoldStatus } : item
      );
      setData(updatedData);

      // Make API call to update the status
      const response = await fetch(`http://localhost:8000/api/product-and-platforms/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': "Bearer 44|cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478",
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ is_sold: tempSoldStatus === "YES" ? true : false })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

    } catch (err) {
      console.error('Error updating status:', err);
      // Revert local state if API call fails
      setData(data);
    } finally {
      setEditingId(null);
      setTempSoldStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <React.Fragment>
      {productsToRemove.length > 0 && (
        <Marquee speed={40} gradient={false} style={{ backgroundColor: '#ffcccc', padding: '14px' }}>
          {productsToRemove.map((product, index) => (
            <span key={index} style={{ marginRight: '50px', fontSize: '14px' }}>
              ⚠️ Remove your product <strong>{product.name}</strong> from: {product.unsoldPlatforms} &nbsp;&nbsp;
            </span>
          ))}
        </Marquee>
      )}

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h4">Product and Platforms</CardTitle>
              <p className="card-title-desc">
                List of products and their associated platforms
              </p>

              {data.length === 0 ? (
                <div className="alert alert-info">No data available</div>
              ) : (
                <div className="table-rep-plugin">
                  <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="product-platform-table" className="table table-striped table-bordered">
                      <Thead>
                        <Tr>
                          <Th data-priority="1">Product Name</Th>
                          <Th data-priority="2">Platform</Th>
                          <Th data-priority="3">Sold</Th>
                          <Th data-priority="4">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.product?.BrandName || 'N/A'}</Td>
                            <Td>{item.platform?.platform_name || 'N/A'}</Td>
                            <Td className="items-center flex justify-center">
                              {editingId === item.id ? (
                                <Input
                                  type="select"
                                  value={tempSoldStatus}
                                  onChange={handleSoldStatusChange}
                                  className="text-xl p-2" // Increase font size and add padding
                                >
                                  <option value={0} className="text-red-500">No</option>
                                  <option value={1} className="text-green-500">Yes</option>
                                </Input>
                              ) : (
                                <span className={`badge border-2 bg-${item.is_sold ? 'success' : 'danger'} text-xl px-4 py-2 `}>
                                  {item.is_sold ? 'Yes' : 'No'}
                                </span>
                              )}
                            </Td>

                            <Td>
                              {editingId === item.id ? (
                                <Button color="success" onClick={() => handleSave(item.id)}>
                                  Save
                                </Button>
                              ) : (
                                <Button color="primary" onClick={() => handleEditClick(item)}>
                                  Edit
                                </Button>
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(ProductLobby);