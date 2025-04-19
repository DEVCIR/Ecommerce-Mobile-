import React, { useEffect, useState } from 'react'
import {BASE_URL} from '../../Service';

const EditInventory = (props) => {
  const [formData, setFormData] = useState({
    productID: '',
    stockQuantity: '',
    purchaseOrderNo: '',
    barcode: '',
    location: ''
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/inventory/${props.productId}`, {
          headers: {
            'Authorization': 'Bearer cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            productID: data.productID,
            stockQuantity: data.stockQuantity,
            purchaseOrderNo: data.purchaseOrderNo,
            barcode: data.barcode,
            location: data.location
          });
        } else {
          console.error('Error fetching product data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProductData();
  }, [props.productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'stockQuantity' || name === 'productID' ? parseInt(value, 10) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/inventory/${props.productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer cz0HARoeeIbtXnowBxEZ3PfcBPOhXyxdeKwXGeQ148685478'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        props.onBackClick(); 
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={props.onBackClick} className="btn btn-secondary mb-3">Back</button>
      <h4>Edit Product ID: {props.productId}</h4>
      <form onSubmit={handleSubmit}>
        <div className="row mb-4">
          <label htmlFor="productID" className="col-sm-3 col-form-label">Product ID</label>
          <div className="col-sm-9">
            <input type="text" className="form-control" id="productID" name="productID" value={formData.productID} onChange={handleChange} required />
          </div>
        </div>
        <div className="row mb-4">
          <label htmlFor="stockQuantity" className="col-sm-3 col-form-label">Stock Quantity</label>
          <div className="col-sm-9">
            <input type="number" className="form-control" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} />
          </div>
        </div>
        <div className="row mb-4">
          <label htmlFor="purchaseOrderNo" className="col-sm-3 col-form-label">Purchase Order No</label>
          <div className="col-sm-9">
            <input type="text" className="form-control" id="purchaseOrderNo" name="purchaseOrderNo" value={formData.purchaseOrderNo} onChange={handleChange} required />
          </div>
        </div>
        <div className="row mb-4">
          <label htmlFor="barcode" className="col-sm-3 col-form-label">Barcode</label>
          <div className="col-sm-9">
            <input type="text" className="form-control" id="barcode" name="barcode" value={formData.barcode} onChange={handleChange} required />
          </div>
        </div>
        <div className="row mb-4">
          <label htmlFor="location" className="col-sm-3 col-form-label">Location</label>
          <div className="col-sm-9">
            <input type="text" className="form-control" id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
        </div>
        <div className="row justify-content-end">
          <div className="col-sm-9">
            <button type="submit" className="btn btn-primary w-md">Update</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditInventory