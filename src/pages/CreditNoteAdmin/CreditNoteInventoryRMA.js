import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Form, Input, Label, Button } from 'reactstrap';
import { Toaster, toast } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';

const CreditNoteInventoryRMA = (rmaData) => {

    useEffect(() => {
        console.log('Data Fetched For RMA => ', rmaData)
    }, []);

    const [rma_number, setRmaNumber] = useState(''); 

    const filteredItems = rmaData.rmaData.orders[0].order.items.filter(item => item.reason);
    rmaData.rmaData.orders[0].order.items = filteredItems;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const rmaDataToSubmit = {
            rma_number: rma_number,
            customer_id: rmaData.rmaData.orders[0].customer.id, // Assuming customer ID is available
            order_id: rmaData.rmaData.orders[0].order.id, // Assuming order ID is available
            status: "Approved",
            reason: rmaData.rmaData.orders[0].order.items.map(item => item.reason).join(', '),
            resolved_date: new Date().toISOString().split('T')[0],
            is_active: true
        };

        try {
            const response = await fetch('http://localhost:8000/api/rmas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rmaDataToSubmit),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            toast.success('RMA submitted successfully!');
            console.log('RMA submitted successfully:', result);

            const rmaItemsToSubmit = [];

            rmaData.rmaData.orders[0].order.items.forEach(item => {
                if (Array.isArray(item.inventory)) {
                    item.inventory.forEach(inventoryItem => {
                        rmaItemsToSubmit.push({
                            rma_id: result.id,
                            inventory_id: inventoryItem.id,
                            quantity: item.quantity,
                            reason: item.reason || '',
                            condition_received: item.condition_received || '',
                            is_active: true
                        });
                    });
                } else {
                    rmaItemsToSubmit.push({
                        rma_id: result.id,
                        inventory_id: item.inventory.id,
                        quantity: item.quantity,
                        reason: item.reason || '',
                        condition_received: item.condition_received || '',
                        is_active: true
                    });
                }
            });

            for (const rmaItem of rmaItemsToSubmit) {
                const itemResponse = await fetch('http://localhost:8000/api/rma-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rmaItem),
                });

                if (!itemResponse.ok) {
                    throw new Error('Network response for RMA item was not ok');
                }

                const itemResult = await itemResponse.json();
                toast.success('RMA item submitted successfully!');
                console.log('RMA item submitted successfully:', itemResult);
            }

            const creditNoteDataToSubmit = {
                credit_note_number: rma_number,
                rma_id: result.id,
                customer_id: rmaData.rmaData.orders[0].customer.id,
                issue_date: new Date().toISOString().split('T')[0],
                total_amount: rmaData.rmaData.orders[0].order.total_amount,
                status: 'Draft',
                notes: '',
                created_by: rmaData.rmaData.orders[0].customer.user.id,
                is_active: true
            };

            const creditNoteResponse = await fetch('http://localhost:8000/api/credit-notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(creditNoteDataToSubmit),
            });

            if (!creditNoteResponse.ok) {
                throw new Error('Network response for credit note was not ok');
            }

            const creditNoteResult = await creditNoteResponse.json();
            toast.success('Credit note submitted successfully!');
            console.log('Credit note submitted successfully:', creditNoteResult);

            const creditNoteItemsToSubmit = [];

            rmaData.rmaData.orders[0].order.items.forEach(item => {
                if (Array.isArray(item.inventory)) {
                    item.inventory.forEach(inventoryItem => {
                        creditNoteItemsToSubmit.push({
                            credit_note_id: creditNoteResult.id,
                            inventory_id: inventoryItem.id,
                            description: item.reason || '',
                            quantity: item.quantity,
                            unit_price: inventoryItem.unit_price || 0,
                            total_price: (inventoryItem.unit_price || 0) * item.quantity,
                            is_active: true
                        });
                    });
                } else {
                    creditNoteItemsToSubmit.push({
                        credit_note_id: creditNoteResult.id,
                        inventory_id: item.inventory.id,
                        description: item.reason || '',
                        quantity: item.quantity,
                        unit_price: item.inventory.unit_price || 0,
                        total_price: (item.inventory.unit_price || 0) * item.quantity,
                        is_active: true
                    });
                }
            });

            for (const creditNoteItem of creditNoteItemsToSubmit) {
                const creditNoteItemResponse = await fetch('http://localhost:8000/api/credit-notes-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(creditNoteItem),
                });

                if (!creditNoteItemResponse.ok) {
                    throw new Error('Network response for credit note item was not ok');
                }

                const creditNoteItemResult = await creditNoteItemResponse.json();
                toast.success('Credit note item submitted successfully!');
                console.log('Credit note item submitted successfully:', creditNoteItemResult);
            }

        } catch (error) {
            toast.error(`Error: ${error.message}`);
            console.error('Error submitting RMA:', error);
        }
    };

    useEffect(() => {
        console.log('Data Fetched For RMA => ', rmaData)
        const generateUniqueCode = () => {
            return Math.random().toString(36).substring(2, 10).toUpperCase();
        };
        setRmaNumber(generateUniqueCode()); 
    }, []);

    return (
        <div>
            <Toaster position="top-right" richColors />
            {/* <div>
                <h5>Selected Order Details:</h5>
                <pre>{JSON.stringify(rmaData, null, 2)}</pre>
            </div> */}
            {/* Add RMA Form */}
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">Add RMA</CardTitle>
                            <Form onSubmit={handleSubmit}>
                                {/* RMA Number */}
                                <Row className="mb-3">
                                    <Label className="col-md-2 col-form-label">RMA Number</Label>
                                    <Col md={10}>
                                        <Input type="text" name="rma_number" value={rma_number} readOnly />
                                    </Col>
                                </Row>

                                {/* Order Selection */}
                                <Row className="mb-3">
                                    <Label className="col-md-2 col-form-label">Order Number</Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="order"
                                            value={rmaData.rmaData.orders[0].order.order_number}
                                            readOnly
                                        />
                                    </Col>
                                </Row>

                                {/* Customer Name */}
                                <Row className="mb-3">
                                    <Label className="col-md-2 col-form-label">Customer</Label>
                                    <Col md={10}>
                                        <Input
                                            type="text"
                                            name="customer"
                                            value={`${rmaData.rmaData.orders[0].customer.user.name} ${rmaData.rmaData.orders[0].customer.user.last_name}`}
                                            readOnly
                                        />
                                    </Col>
                                </Row>

                                {/* Order Items */}
                                <>
                                    {rmaData.rmaData.orders[0].order.items.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <Row className="mb-3 align-items-center">
                                                <Label className="col-md-2 col-form-label">{`Product ${index + 1}`}</Label>
                                                <Col md={8}>
                                                    <Input type="text" readOnly value={item.inventory?.variant?.product?.model_name || 'N/A'} />
                                                </Col>                                            </Row>
                                            <Row className="mb-3">
                                                <Label className="col-md-2 col-form-label">{`Quantity ${index + 1}`}</Label>
                                                <Col md={10}>
                                                    <Input type="text" readOnly value={item.quantity} />
                                                </Col>
                                            </Row>
                                            <Row className="mb-3" key={item.id}>
                                                <Label className="col-md-2 col-form-label">{`Reason for Item ${index + 1}`}</Label>
                                                <Col md={10}>
                                                    <Input
                                                        type="text"
                                                        name={`reason_${index}`}
                                                        value={item.reason || ''}
                                                        readOnly
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    ))}
                                </>


                                {/* Resolved Date */}
                                <Row className="mb-3">
                                    <Label className="col-md-2 col-form-label">Resolved Date</Label>
                                    <Col md={10}>
                                        <Input type="date" name="resolved_date" value={new Date().toISOString().split('T')[0]} readOnly />
                                    </Col>
                                </Row>

                                {/* Status */}
                                <Row className="mb-3">
                                    <Label className="col-md-2 col-form-label">Status</Label>
                                    <Col md={10}>
                                        <Input type="text" name="status" value="Approved" readOnly />
                                    </Col>
                                </Row>


                                {/* Buttons */}
                                <Row className="mb-3">
                                    <Col className="text-end">
                                        <Button color="primary" type="submit">
                                            Save RMA
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default CreditNoteInventoryRMA
