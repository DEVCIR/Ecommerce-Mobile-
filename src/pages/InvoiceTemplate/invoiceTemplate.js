import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoiceTemplate() {
  const invoiceRef = useRef(null);
  const invoiceFields = ['Invoice No', 'Invoice Date', 'Due Date'];
  const location = useLocation();
  const invoiceData = location.state || {};
  const [invoiceValues, setInvoiceValues] = useState({
    'Invoice No': invoiceData.invoiceNumber || '#INV123',
    'Invoice Date': invoiceData.invoiceDate || '04/19/2025',
    'Due Date': invoiceData.dueDate || '04/19/2025'
  });
  
  const [paymentValues, setPaymentValues] = useState({
    'Account': '',
    'A/C Name': '',
    'Bank Details': ''
  });
  
  
  const [companyName, setCompanyName] = useState('');
  const [recipientName, setRecipientName] = useState(invoiceData.customerName || '');
  const [items, setItems] = useState(invoiceData.items || []);
  const [profilePicture, setProfilePicture] = useState(invoiceData.profilePicture || '');
  const [useTax, setUseTax] = useState(true);
  const [useTaxFixed, setUseTaxFixed] = useState(true);
  const [taxFixed, setTaxFixed] = useState(invoiceData.taxFixed || 0);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);

  const addNewRow = () => {
    if (items.length === 0) {
      setItems([...items, { description: '', qty: '', rate: '', amount: 0 }]);
    }
  };

  const removeRow = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'qty' || field === 'rate') {
      const qty = parseFloat(field === 'qty' ? value : newItems[index].qty) || 0;
      const rate = parseFloat(field === 'rate' ? value : newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    
    setItems(newItems);
  };
  
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    setSubtotal(newSubtotal);
    
    const newTaxAmount = useTax ? newSubtotal * (taxRate / 100) : 0;
  setTaxAmount(newTaxAmount);
  
  const fixedTax = useTaxFixed ? parseFloat(taxFixed) : 0;
  
  setTotal(newSubtotal + newTaxAmount + fixedTax);
}, [items, taxRate, taxFixed, useTax, useTaxFixed]);

  // Add initial empty row
  useEffect(() => {
    if (items.length === 0) {
      addNewRow();
    }
  }, []);
  
const downloadPDF = () => {
  const input = invoiceRef.current;
  
  // Get the actual width of the invoice content
  const invoiceWidth = input.offsetWidth;
  const invoiceHeight = input.offsetHeight;
  
  // Calculate the optimal scale for A4 paper (210mm x 297mm)
  const pdfWidth = 210; // mm
  const pdfHeight = 297; // mm
  
  // Convert mm to pixels (1mm = 3.78px at 96dpi)
  const pdfWidthPx = pdfWidth * 3.78;
  const pdfHeightPx = pdfHeight * 3.78;
  
  // Calculate scale to fit content width to PDF width
  const scale = Math.min(pdfWidthPx / invoiceWidth, 1);
  
  html2canvas(input, {
    scale: scale,
    logging: false,
    useCORS: true,
    allowTaint: true,
    windowWidth: invoiceWidth,
    windowHeight: invoiceHeight
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate image dimensions to fit PDF page
    const imgWidth = pdfWidth - 20; // Add margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Center the image on the page
    const xPos = (pdfWidth - imgWidth) / 2;
    let yPos = 10; // Start with top margin
    
    // Add first page
    pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
    yPos += imgHeight;    
    pdf.save(`Invoice_${invoiceValues['Invoice No'].replace('#', '')}.pdf`);
  });
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
          <div>
  <input
    type="file"
    id="upload-img"
    accept="image/png, image/jpeg"
    style={{ display: 'none' }}
  />
  <label htmlFor="upload-img" style={{ cursor: 'pointer', display: 'inline-block' }}>
    <div style={{ color: '#a0c0e0', fontSize: '24px', marginBottom: '5px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    </div>
  </label>
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
                <span style={{ fontWeight: '500', color: '#666' }}>XYZ Company</span>
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="xyz company details"
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
          
<div style={{ width: '55%' }}>
  <div style={{ marginBottom: '20px' }}>
    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>BILLED TO :</div>
    
    {/* Customer Profile Section */}
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
      {/* Profile Picture Container */}
      <div style={{ 
        width: '30px', 
        height: '30px', 
        borderRadius: '50%', 
        overflow: 'hidden',
        marginRight: '12px',
        flexShrink: 0,
        backgroundColor: '#f0f0f0'
      }}>
        {profilePicture ? (
          <img 
            src={`${profilePicture}`} 
            alt="Customer" 
            style={{ 
              width: '80%', 
              height: '80%', 
              objectFit: 'cover',
              display: 'block' 
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.style.backgroundColor = '#e0e0e0';
            }}
          />
        ) : (
          <div style={{
            width: '80%',
            height: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px'
          }}>
            No Image
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', color: '#666', marginBottom: '8px' }}>
          {recipientName || 'Customer name'}
        </div>

        <div style={{ marginBottom: '5px' }}>
          <input 
            type="text" 
            value={recipientName} 
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Customer name"
            style={{ 
              width: '100%', 
              border: 'none', 
              background: 'transparent', 
              outline: 'none',
              color: '#666',
              fontSize: '13px',
              padding: '3px 0'
            }} 
          />
        </div>

        <div style={{ marginBottom: '5px' }}>
          <input 
            type="email" 
            value={invoiceData.customerEmail || ''} 
            onChange={(e) => {}}
            placeholder="Email of Customer"
            style={{ 
              width: '100%', 
              border: 'none', 
              background: 'transparent', 
              outline: 'none',
              color: '#666',
              fontSize: '13px',
              padding: '3px 0'
            }} 
            readOnly
          />
        </div>

        <div>
          <input 
            type="text" 
            value={invoiceData.customerCity || ''} 
            onChange={(e) => {}}
            placeholder="Address of Customer (City + Country)"
            style={{ 
              width: '100%', 
              border: 'none', 
              background: 'transparent', 
              outline: 'none',
              color: '#666',
              fontSize: '13px',
              padding: '3px 0'
            }} 
            readOnly
          />
        </div>
      </div>
    </div>
  </div>
  
  {/* Invoice Details Section */}
  <div style={{ 
    background: '#f7faff', 
    borderRadius: '4px', 
    padding: '15px',
    marginBottom: '20px'
  }}>
    {invoiceFields.map((field, index) => (
      <div 
        key={index} 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: index < invoiceFields.length - 1 ? '8px' : 0
        }}
      >
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
        <div style={{ display: 'flex', justifyContent: 'right',alignItems:'right'
         }}>
          {/* Payment Info */}
     
          
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
    <input
      type="checkbox"
      checked={useTax}
      onChange={() => setUseTax(!useTax)}
      style={{ marginRight: '10px' }}
    />
    <span style={{ marginRight: '10px' }}>Tax</span>
    {useTax && (
      <>
        <input 
          type="number" 
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          style={{ 
            width: '63px', 
            padding: '2px 5px', 
            border: '1px solid #ddd',
            borderRadius: '3px',
            textAlign: 'center'
          }} 
        />
        <span style={{ marginLeft: '5px' }}>%</span>
      </>
    )}
  </div>
  <span>{useTax ? taxAmount.toFixed(2) : '0.00'}</span>
</div>
            
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: '10px 0', 
  borderBottom: '1px solid #eee' 
}}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="checkbox"
      checked={useTaxFixed}
      onChange={() => setUseTaxFixed(!useTaxFixed)}
      style={{ marginRight: '10px' }}
    />
    <span style={{ marginRight: '10px' }}>Tax Fixed</span>
  </div>
  <span>{useTaxFixed ? taxFixed.toFixed(2) : '0.00'}</span>
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
        <div style={{ width: '100%',marginTop:'10px'}}>
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
      </div>
      
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



