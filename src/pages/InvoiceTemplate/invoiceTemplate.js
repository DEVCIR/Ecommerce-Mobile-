import React, { useState, useEffect, useRef } from 'react';

export default function InvoiceTemplate() {
  // Ref for the invoice content
  const invoiceRef = useRef(null);
  
  // Store field names in arrays
  const invoiceFields = ['Invoice No', 'Invoice Date', 'Due Date'];
  const invoiceValues = {
    'Invoice No': '#INV123',
    'Invoice Date': '04/19/2025',
    'Due Date': '04/19/2025'
  };
  
  const paymentFields = ['Account', 'A/C Name', 'Bank Details'];
  const [paymentValues, setPaymentValues] = useState({
    'Account': '',
    'A/C Name': '',
    'Bank Details': ''
  });
  
  // Company details
  const [companyName, setCompanyName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  
  // State for invoice items
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // Add a new empty row
  const addNewRow = () => {
    setItems([...items, { description: '', qty: '', rate: '', amount: 0 }]);
  };

  // Remove a row at specified index
  const removeRow = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  // Update an item in the invoice
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Calculate amount if qty or rate changes
    if (field === 'qty' || field === 'rate') {
      const qty = parseFloat(field === 'qty' ? value : newItems[index].qty) || 0;
      const rate = parseFloat(field === 'rate' ? value : newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    
    setItems(newItems);
  };
  
  // Update payment info
  const updatePaymentInfo = (field, value) => {
    setPaymentValues({
      ...paymentValues,
      [field]: value
    });
  };

  // Calculate totals whenever items change
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    setSubtotal(newSubtotal);
    
    const newTaxAmount = newSubtotal * (taxRate / 100);
    setTaxAmount(newTaxAmount);
    
    setTotal(newSubtotal + newTaxAmount);
  }, [items, taxRate]);

  // Add initial empty row
  useEffect(() => {
    if (items.length === 0) {
      addNewRow();
    }
  }, []);
  
  // Function to handle invoice download
  const downloadPDF = () => {
    // Prepare invoice data for logging
    const invoiceData = {
      company: companyName || 'Not specified',
      recipient: recipientName || 'Not specified',
      invoiceDetails: invoiceValues,
      items: items,
      paymentInfo: paymentValues,
      calculations: {
        subtotal,
        taxRate,
        taxAmount,
        total
      }
    };
    
    // Log data to console
    console.log('Invoice Data for PDF:', invoiceData);
    
    // In a real application, this would use a library like jsPDF or html2pdf
    // Since we can't import external libraries beyond those specified,
    // we'll simulate the PDF generation with this approach
    
    // Create a simple text representation of the invoice (in real apps, this would be formatted properly)
    const invoiceText = `
INVOICE #${invoiceValues['Invoice No']}
Date: ${invoiceValues['Invoice Date']}
Due Date: ${invoiceValues['Due Date']}

From: ${companyName || 'Your Company'}
To: ${recipientName || 'Recipient'}

Items:
${items.map(item => `${item.description || 'Item'} - Qty: ${item.qty || '0'}, Rate: ${item.rate || '0.00'}, Amount: ${item.amount ? item.amount.toFixed(2) : '0.00'}`).join('\n')}

Subtotal: ${subtotal.toFixed(2)}
Tax (${taxRate}%): ${taxAmount.toFixed(2)}
Total: ${total.toFixed(2)}

Payment Information:
${Object.entries(paymentValues)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')}
    `;
    
    // Create a Blob with the invoice text
    const blob = new Blob([invoiceText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the blob
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceValues['Invoice No'].replace('#', '')}`.pdf;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div ref={invoiceRef}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#333', 
          marginBottom: '20px' 
        }}>INVOICE</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Left side - Company info */}
          <div style={{ width: '40%' }}>
            <div style={{ 
              border: '1px dashed #ccc', 
              padding: '20px', 
              marginBottom: '15px',
              background: '#f5f9ff',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100px'
            }}>
              <div style={{ color: '#a0c0e0', fontSize: '24px', marginBottom: '5px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span style={{ color: '#a0c0e0', fontSize: '14px' }}>Upload Image</span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: '#e0e0e0', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginRight: '8px' 
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span style={{ fontWeight: '500', color: '#666' }}>Company name</span>
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Add your company details"
                  style={{ 
                    width: '100%', 
                    border: 'none', 
                    background: 'transparent', 
                    outline: 'none',
                    color: '#999',
                    fontSize: '13px'
                  }} 
                />
              </div>
            </div>
          </div>
          
          {/* Right side - Billing info and invoice details */}
          <div style={{ width: '55%' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>BILLED TO :</div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: '#e0e0e0', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginRight: '8px' 
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span style={{ fontWeight: '500', color: '#666' }}>Recipient</span>
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <input 
                  type="text" 
                  value={recipientName} 
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Add invoice recipient details"
                  style={{ 
                    width: '100%', 
                    border: 'none', 
                    background: 'transparent', 
                    outline: 'none',
                    color: '#999',
                    fontSize: '13px'
                  }} 
                />
              </div>
            </div>
            
            <div style={{ 
              background: '#f7faff', 
              borderRadius: '4px', 
              padding: '15px',
              marginBottom: '20px'
            }}>
              {invoiceFields.map((field, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: index < invoiceFields.length - 1 ? '8px' : 0
                }}>
                  <div style={{ fontWeight: '500', color: '#555' }}>{field} :</div>
                  <div style={{ color: '#333' }}>{invoiceValues[field]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Invoice items table */}
        <div style={{ marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f9ff' }}>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px', borderBottom: '1px solid #eee' }}>Item Description</th>
                <th style={{ padding: '10px', textAlign: 'center', fontSize: '14px', borderBottom: '1px solid #eee', width: '80px' }}>Qty</th>
                <th style={{ padding: '10px', textAlign: 'center', fontSize: '14px', borderBottom: '1px solid #eee', width: '100px' }}>Rate</th>
                <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px', borderBottom: '1px solid #eee', width: '100px' }}>Amount</th>
                <th style={{ padding: '10px', textAlign: 'center', fontSize: '14px', borderBottom: '1px solid #eee', width: '50px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    <input 
                      type="text" 
                      value={item.description} 
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }} 
                    />
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    <input 
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      placeholder="0"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'center', outline: 'none' }} 
                    />
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                    <input 
                      type="number" 
                      value={item.rate} 
                      onChange={(e) => updateItem(index, 'rate', e.target.value)}
                      placeholder="0.00"
                      style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'center', outline: 'none' }} 
                    />
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                    {item.amount ? item.amount.toFixed(2) : '0.00'}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    <button 
                      onClick={() => removeRow(index)}
                      style={{ 
                        background: 'transparent',
                        border: 'none',
                        color: '#ff5252',
                        cursor: 'pointer',
                        padding: '5px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Add row button */}
          <div style={{ 
            padding: '10px', 
            textAlign: 'center', 
            borderBottom: '1px solid #eee',
            marginTop: items.length === 0 ? '10px' : '0'
          }}>
            <button 
              onClick={addNewRow}
              style={{ 
                background: 'transparent',
                border: 'none',
                color: '#4a90e2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '5px 0'
              }}
            >
              <span style={{ marginRight: '5px', fontSize: '16px' }}>+</span> Add new row
            </button>
          </div>
        </div>
        
        {/* Payment info and Totals section */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Payment Info */}
          <div style={{ width: '48%' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>Payment Info :</h3>
            
            {paymentFields.map((field, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', color: '#555', marginBottom: '3px' }}>{field} :</div>
                <input 
                  type="text" 
                  value={paymentValues[field]} 
                  onChange={(e) => updatePaymentInfo(field, e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '5px 0', 
                    border: 'none', 
                    borderBottom: '1px solid #ddd',
                    outline: 'none'
                  }} 
                />
              </div>
            ))}
            
            {/* Terms & Conditions */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>Terms & Conditions</h3>
              <p style={{ 
                fontSize: '13px', 
                color: '#666', 
                fontStyle: 'italic', 
                lineHeight: '1.5' 
              }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          
          {/* Totals */}
          <div style={{ width: '48%' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px 0', 
              borderBottom: '1px solid #eee' 
            }}>
              <span>Sub Total</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px 0', 
              borderBottom: '1px solid #eee' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>Tax</span>
                <input 
                  type="number" 
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  style={{ 
                    width: '40px', 
                    padding: '2px 5px', 
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    textAlign: 'center'
                  }} 
                />
                <span style={{ marginLeft: '5px' }}>%</span>
              </div>
              <span>{taxAmount.toFixed(2)}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '15px 0',
              background: '#f5f9ff',
              fontWeight: '500',
              marginTop: '10px'
            }}>
              <span>Total</span>
              <span>{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download Invoice Button */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={downloadPDF}
          style={{ 
            background: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 25px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#3a7bc8'}
          onMouseOut={(e) => e.currentTarget.style.background = '#4a90e2'}
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
}