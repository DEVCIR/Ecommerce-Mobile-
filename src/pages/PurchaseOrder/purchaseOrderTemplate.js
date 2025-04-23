import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PurchaseOrderTemplate = ({ order, onBackClick }) => {
    const [items, setItems] = useState([]); // Initialize items as an empty array
    const [requisitioner, setRequisitioner] = useState(order.requisitioner || '');
    const [shipVia, setShipVia] = useState(order.shipVia || '');
    const [fob, setFob] = useState(order.fob || '');
    const [shippingTerms, setShippingTerms] = useState(order.shippingTerms || '');

    // New state variables for TAX, SHIPPING, and OTHER
    const [tax, setTax] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [other, setOther] = useState(0);

    const templateRef = useRef(); // Reference to the template for PDF generation

    useEffect(() => {
        console.log("Order Data: ", order)
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/purchase-order-items/?po_id=${order.id}`);
                const result = await response.json();
                if (result.data && result.data.data) {
                    const fetchedItems = result.data.data.map(item => ({
                        id: item.id,
                        itemNum: item.product.sku, // Assuming SKU is used as item number
                        description: item.product.description,
                        qty: item.quantity,
                        unitPrice: parseFloat(item.unit_price), // Convert to float
                    }));
                    setItems(fetchedItems);
                }
            } catch (error) {
                console.error("Error fetching purchase order items:", error);
            }
        };

        fetchItems();
    }, [order.id]); // Fetch items when the order ID changes

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal + parseFloat(tax) + parseFloat(shipping) + parseFloat(other);
    };

    const addItem = () => {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems([...items, { id: newId, itemNum: '', description: '', qty: 0, unitPrice: 0 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: field === 'qty' || field === 'unitPrice' ? parseFloat(value) || 0 : value } : item
        ));
    };

    useEffect(() => {
        console.log("Orders", order)
    }, [])

    const total = calculateTotal();

    const downloadPDF = () => {
        html2canvas(templateRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190; // Adjust width as needed
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('purchase_order_template.pdf');
        });
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '16px',
        fontSize: '14px'
    };

    const borderBoxStyle = {
        border: '1px solid #d1d5db',
        padding: '16px',
        width: '100%'
    };

    const headerContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '16px'
    };

    const companyInfoStyle = {
        width: '100%',
        color: '#1f2937'
    };

    const purchaseOrderTitleStyle = {
        width: '100%',
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#3b82f6'
    };

    const datePoContainerStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '8px'
    };

    const datePoBoxStyle = {
        marginRight: '8px'
    };

    const inputFieldStyle = {
        border: '1px solid #d1d5db',
        padding: '4px',
        width: '128px'
    };

    const vendorShipContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px'
    };

    const vendorBoxStyle = {
        width: '100%',
        marginBottom: '16px'
    };

    const blueTitleStyle = {
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '8px',
        fontWeight: 'bold'
    };

    const borderBoxPaddingStyle = {
        border: '1px solid #d1d5db',
        padding: '8px'
    };

    const detailsHeaderStyle = {
        display: 'flex'
    };

    const detailsColumnHeaderStyle = {
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '8px',
        fontWeight: 'bold',
        width: '25%'
    };

    const detailsRowStyle = {
        display: 'flex'
    };

    const detailsCellStyle = {
        border: '1px solid #d1d5db',
        padding: '4px',
        width: '25%'
    };

    const fullWidthInputStyle = {
        width: '100%',
        padding: '4px'
    };

    const tableHeaderStyle = {
        display: 'flex'
    };

    const itemNumberHeaderStyle = {
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '8px',
        fontWeight: 'bold',
        width: '16.667%'
    };

    const descriptionHeaderStyle = {
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '8px',
        fontWeight: 'bold',
        width: '33.333%'
    };

    const qtyUnitTotalHeaderStyle = {
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '8px',
        fontWeight: 'bold',
        width: '16.667%'
    };

    const itemRowStyle = {
        display: 'flex',
        border: '1px solid #d1d5db'
    };

    const itemNumberCellStyle = {
        padding: '8px',
        width: '16.667%',
        display: 'flex',
        alignItems: 'center'
    };

    const descriptionCellStyle = {
        padding: '8px',
        width: '33.333%',
        display: 'flex',
        alignItems: 'center'
    };

    const qtyCellStyle = {
        padding: '8px',
        width: '16.667%',
        display: 'flex',
        alignItems: 'center'
    };

    const unitPriceCellStyle = {
        padding: '8px',
        width: '16.667%',
        display: 'flex',
        alignItems: 'center'
    };

    const totalCellStyle = {
        padding: '8px',
        width: '16.667%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const textRightStyle = {
        textAlign: 'right',
        width: '100%'
    };

    const deleteButtonStyle = {
        marginLeft: '8px',
        color: '#ef4444',
        cursor: 'pointer'
    };

    const addButtonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '8px'
    };

    const addButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        color: '#2563eb',
        cursor: 'pointer'
    };

    const addIconStyle = {
        marginRight: '4px'
    };

    const commentsAndTotalsStyle = {
        display: 'flex',
        flexDirection: 'column'
    };

    const commentsBoxStyle = {
        width: '100%',
        marginBottom: '16px'
    };

    const commentsHeaderStyle = {
        backgroundColor: '#d1d5db',
        padding: '8px',
        fontWeight: 'bold'
    };

    const commentsTextareaStyle = {
        border: '1px solid #d1d5db',
        padding: '8px',
        width: '100%',
        height: '128px'
    };

    const totalsBoxStyle = {
        width: '100%'
    };

    const totalRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px'
    };

    const totalLabelStyle = {
        fontWeight: 'bold',
        textAlign: 'right'
    };

    const totalValueStyle = {
        borderBottom: '1px solid #d1d5db',
        width: '128px',
        textAlign: 'right'
    };

    const finalTotalRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#dbeafe',
        padding: '4px'
    };

    const finalTotalValueStyle = {
        width: '128px',
        textAlign: 'right',
        fontWeight: 'bold'
    };

    const footerStyle = {
        marginTop: '16px',
        textAlign: 'center',
        color: '#047857',
        fontSize: '12px'
    };

    return (
        <>
            <div style={containerStyle} ref={templateRef}>
                <div style={borderBoxStyle}>
                    {/* Header */}
                    <div style={headerContainerStyle}>
                        <div style={{ ...companyInfoStyle, display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '50%' }}>
                                <div style={{ color: '#1f2937' }}>XYZ Company</div>
                                <div style={{ color: '#1f2937' }}>XYZ Street</div>
                                <div style={{ color: '#1f2937' }}>XYZ City, 4567</div>
                                <div style={{ color: '#1f2937' }}>Phone: (123) 456-7890</div>
                                <div style={{ color: '#1f2937' }}>Fax: (123) 456-7890</div>
                                <div style={{ color: '#1f2937' }}>Website: https://devcir.com</div>
                            </div>
                            <div style={{ width: '50%' }}>
                                <div style={purchaseOrderTitleStyle}>PURCHASE ORDER</div>
                                <div style={datePoContainerStyle}>
                                    <div style={datePoBoxStyle}>
                                        <div style={{ color: '#1f2937' }}>DATE</div>
                                        <input type="text" style={inputFieldStyle} defaultValue={new Date(order.order_date).toLocaleDateString()} />
                                    </div>
                                    <div>
                                        <div style={{ color: '#1f2937' }}>PO #</div>
                                        <input type="text" style={inputFieldStyle} defaultValue={order.po_number} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vendor and Ship To */}
                    <div style={{ ...vendorShipContainerStyle, display: 'flex', flexDirection: 'row' }}>
                        <div style={{ ...vendorBoxStyle, paddingRight: '8px', width: '100%' }}>
                            <div style={blueTitleStyle}>VENDOR</div>
                            <div style={borderBoxPaddingStyle}>
                                <div>{order.supplier.user.name}</div>
                                <div>{order.supplier.contact_person}</div>
                                <div>{order.supplier.address}</div>
                                <div>{order.supplier.user.phone_number}</div>
                                <div>{order.supplier.user.email}</div>
                            </div>
                        </div>
                        {/* <div style={{width: '50%', paddingLeft: '8px'}}>
                        <div style={blueTitleStyle}>SHIP TO</div>
                        <div style={borderBoxPaddingStyle}>
                            <div>[Name]</div>
                            <div>[Company Name]</div>
                            <div>[Street Address]</div>
                            <div>[City, ST ZIP]</div>
                            <div>[Phone]</div>
                        </div>
                    </div> */}
                    </div>

                    {/* Requisitioner, Ship Via, FOB, Shipping Terms - Now Editable */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={detailsHeaderStyle}>
                            <div style={detailsColumnHeaderStyle}>REQUISITIONER</div>
                            <div style={detailsColumnHeaderStyle}>SHIP VIA</div>
                            <div style={detailsColumnHeaderStyle}>F.O.B.</div>
                            <div style={detailsColumnHeaderStyle}>SHIPPING TERMS</div>
                        </div>
                        <div style={detailsRowStyle}>
                            <div style={detailsCellStyle}>
                                <input
                                    type="text"
                                    value={requisitioner}
                                    onChange={(e) => setRequisitioner(e.target.value)}
                                    style={fullWidthInputStyle}
                                    placeholder="Enter requisitioner"
                                />
                            </div>
                            <div style={detailsCellStyle}>
                                <input
                                    type="text"
                                    value={shipVia}
                                    onChange={(e) => setShipVia(e.target.value)}
                                    style={fullWidthInputStyle}
                                    placeholder="Enter shipping method"
                                />
                            </div>
                            <div style={detailsCellStyle}>
                                <input
                                    type="text"
                                    value={fob}
                                    onChange={(e) => setFob(e.target.value)}
                                    style={fullWidthInputStyle}
                                    placeholder="Enter F.O.B."
                                />
                            </div>
                            <div style={detailsCellStyle}>
                                <input
                                    type="text"
                                    value={shippingTerms}
                                    onChange={(e) => setShippingTerms(e.target.value)}
                                    style={fullWidthInputStyle}
                                    placeholder="Enter shipping terms"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={tableHeaderStyle}>
                            <div style={itemNumberHeaderStyle}>ITEM #</div>
                            <div style={descriptionHeaderStyle}>DESCRIPTION</div>
                            <div style={qtyUnitTotalHeaderStyle}>QTY</div>
                            <div style={qtyUnitTotalHeaderStyle}>UNIT PRICE</div>
                            <div style={qtyUnitTotalHeaderStyle}>TOTAL</div>
                        </div>

                        {items.map((item) => (
                            <div key={item.id} style={itemRowStyle}>
                                <div style={itemNumberCellStyle}>
                                    <input
                                        type="text"
                                        value={item.itemNum}
                                        onChange={(e) => updateItem(item.id, 'itemNum', e.target.value)}
                                        style={fullWidthInputStyle}
                                    />
                                </div>
                                <div style={descriptionCellStyle}>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        style={fullWidthInputStyle}
                                    />
                                </div>
                                <div style={qtyCellStyle}>
                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                        style={{ ...fullWidthInputStyle, textAlign: 'right' }}
                                        min="0"
                                    />
                                </div>
                                <div style={unitPriceCellStyle}>
                                    <input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                        style={{ ...fullWidthInputStyle, textAlign: 'right' }}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div style={totalCellStyle}>
                                    <span style={textRightStyle}>{(item.qty * item.unitPrice).toFixed(2)}</span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        style={deleteButtonStyle}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div style={addButtonContainerStyle}>
                            <button
                                onClick={addItem}
                                style={addButtonStyle}
                            >
                                <Plus size={16} style={addIconStyle} />
                                Add Item
                            </button>
                        </div>
                    </div>

                    {/* TAX, SHIPPING, OTHER Inputs */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '33.333%' }}>
                                <label style={{ fontWeight: 'bold' }}>TAX</label>
                                <input
                                    type="number"
                                    value={tax}
                                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                    style={{ ...fullWidthInputStyle, textAlign: 'right' }}
                                    placeholder="Enter tax"
                                />
                            </div>
                            <div style={{ width: '33.333%' }}>
                                <label style={{ fontWeight: 'bold' }}>SHIPPING</label>
                                <input
                                    type="number"
                                    value={shipping}
                                    onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                                    style={{ ...fullWidthInputStyle, textAlign: 'right' }}
                                    placeholder="Enter shipping"
                                />
                            </div>
                            <div style={{ width: '33.333%' }}>
                                <label style={{ fontWeight: 'bold' }}>OTHER</label>
                                <input
                                    type="number"
                                    value={other}
                                    onChange={(e) => setOther(parseFloat(e.target.value) || 0)}
                                    style={{ ...fullWidthInputStyle, textAlign: 'right' }}
                                    placeholder="Enter other"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Comments and Totals */}
                    <div style={{ ...commentsAndTotalsStyle, display: 'flex', flexDirection: 'row' }}>
                        <div style={{ ...commentsBoxStyle, width: '60%', paddingRight: '16px' }}>
                            <div style={commentsHeaderStyle}>Comments or Special Instructions</div>
                            <textarea style={commentsTextareaStyle}></textarea>
                        </div>
                        <div style={{ ...totalsBoxStyle, width: '40%' }}>
                            <div style={totalRowStyle}>
                                <div style={totalLabelStyle}>SUBTOTAL</div>
                                <div style={totalValueStyle}>{calculateSubtotal().toFixed(2)}</div>
                            </div>
                            <div style={totalRowStyle}>
                                <div style={totalLabelStyle}>TAX</div>
                                <div style={totalValueStyle}>{tax.toFixed(2)}</div>
                            </div>
                            <div style={totalRowStyle}>
                                <div style={totalLabelStyle}>SHIPPING</div>
                                <div style={totalValueStyle}>{shipping.toFixed(2)}</div>
                            </div>
                            <div style={totalRowStyle}>
                                <div style={totalLabelStyle}>OTHER</div>
                                <div style={totalValueStyle}>{other.toFixed(2)}</div>
                            </div>
                            <div style={finalTotalRowStyle}>
                                <div style={totalLabelStyle}>TOTAL</div>
                                <div style={finalTotalValueStyle}>$ {total.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Download PDF Button */}
            <div style={{ ...footerStyle, marginTop: '16px' }}>
                <button
                    onClick={downloadPDF}
                    style={{ ...footerStyle, marginTop: '16px' }}
                >
                    Download PDF
                </button>
            </div>
        </>
    );
}

export default PurchaseOrderTemplate;