import React, { useState } from 'react';

export default function Newsletter() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:8000/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      const emailResponse = await fetch('http://localhost:8000/api/sendsubscriptionmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          role: "Customer",
          email: formData.email
        })
      });

      if (!emailResponse.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      

      setMessage({
        text: 'Thank you for subscribing to our newsletter!',
        type: 'success'
      });


      setFormData({ name: '', email: '' }); // Reset form
    } catch (error) {
      setMessage({
        text: error.message || 'An error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Stay Updated</h2>
                <p className="text-muted">
                  Subscribe to our newsletter for the latest news, products, and offers.
                </p>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} mb-4`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address*</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <div className="text-center">
                  <h4 className="fw-bold">10K+</h4>
                  <small className="text-muted">Subscribers</small>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold">99%</h4>
                  <small className="text-muted">Open Rate</small>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold">1K+</h4>
                  <small className="text-muted">Monthly Readers</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}