import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export default function PromotionalNewsletter() {
  const [activeTab, setActiveTab] = useState('compose');
  const [newsletterType, setNewsletterType] = useState('promotional');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [newsletters, setNewsletters] = useState([
    { id: 1, type: 'promotional', subject: 'Summer Sale - 50% Off!', sent: true, openRate: '38%', clickRate: '12%', date: '2025-04-20' },
    { id: 2, type: 'informational', subject: 'April Company Update', sent: true, openRate: '52%', clickRate: '27%', date: '2025-04-15' },
    { id: 3, type: 'promotional', subject: 'New Product Launch', sent: false, scheduled: '2025-04-25', date: '2025-04-23' }
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      minHeight: '100vh',
      backgroundColor: '#f5f7f9'
    },
    header: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1.5rem 0',
      marginBottom: '1.5rem'
    },
    headerContainer: {
      width: '90%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      margin: 0
    },
    mainContainer: {
      width: '90%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    notification: {
      padding: '0.75rem 1rem',
      borderRadius: '0.25rem',
      marginBottom: '1rem'
    },
    successNotification: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    errorNotification: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c'
    },
    tabContainer: {
      display: 'inline-flex',
      backgroundColor: 'white',
      padding: '0.25rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    },
    tabButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '0.875rem',
      cursor: 'pointer',
      margin: '0 0.125rem',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease'
    },
    activeTabButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    inactiveTabButton: {
      backgroundColor: 'transparent',
      color: '#333'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: '#4b5563'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      border: '1px solid #d1d5db',
      outline: 'none',
      fontSize: '0.875rem',
      fontFamily: 'inherit'
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      border: '1px solid #d1d5db',
      outline: 'none',
      resize: 'vertical',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      minHeight: '100px'
    },
    contentTextarea: {
      height: '250px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem'
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      transition: 'background-color 0.2s ease'
    },
    primaryButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    successButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#e5e7eb',
      color: '#374151'
    },
    typeToggle: {
      display: 'flex',
      marginBottom: '1rem'
    },
    typeButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontFamily: 'inherit'
    },
    typeButtonLeft: {
      borderTopLeftRadius: '0.25rem',
      borderBottomLeftRadius: '0.25rem'
    },
    typeButtonRight: {
      borderTopRightRadius: '0.25rem',
      borderBottomRightRadius: '0.25rem'
    },
    activeTypeButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    inactiveTypeButton: {
      backgroundColor: '#e5e7eb',
      color: '#374151'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHead: {
      backgroundColor: '#f3f4f6',
      textAlign: 'left'
    },
    tableCell: {
      padding: '0.75rem 1rem',
      borderTop: '1px solid #e5e7eb'
    },
    tableCellHeader: {
      padding: '0.75rem 1rem',
      fontWeight: '500'
    },
    tableRow: {
      transition: 'background-color 0.2s ease'
    },
    tableRowHover: {
      backgroundColor: '#f9fafb'
    },
    badge: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    promoBadge: {
      backgroundColor: '#fce7f3',
      color: '#9d174d'
    },
    infoBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    sentStatus: {
      color: '#16a34a'
    },
    scheduledStatus: {
      color: '#ea580c'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem'
    },
    statsCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1.5rem'
    },
    statsTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    statsContent: {
      height: '250px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statsFlexContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statsDivider: {
      height: '4rem',
      width: '1px',
      backgroundColor: '#d1d5db',
      margin: '0 2rem'
    },
    statsMetric: {
      textAlign: 'center'
    },
    statsValue: {
      fontSize: '3rem',
      fontWeight: 'bold'
    },
    statsBlue: {
      color: '#2563eb'
    },
    statsGreen: {
      color: '#10b981'
    },
    statsPurple: {
      color: '#8b5cf6'
    },
    statsLabel: {
      color: '#6b7280',
      marginTop: '0.5rem'
    },
    previewContainer: {
      marginBottom: '1.5rem'
    },
    previewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    previewTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    previewContent: {
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      padding: '1rem'
    },
    previewSubject: {
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    previewBody: {
      borderTop: '1px solid #d1d5db',
      paddingTop: '0.5rem',
      whiteSpace: 'pre-wrap'
    },
    // New styles for email chips
    emailChipsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.25rem',
      minHeight: '50px'
    },
    emailChip: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#e5e7eb',
      borderRadius: '9999px',
      padding: '0.25rem 0.75rem',
      fontSize: '0.875rem'
    },
    removeEmailButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#4b5563',
      cursor: 'pointer',
      marginLeft: '0.5rem',
      fontSize: '1rem',
      padding: '0 0.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emailInputContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    emailInput: {
      flex: '1',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      border: '1px solid #d1d5db',
      outline: 'none',
      fontSize: '0.875rem',
      fontFamily: 'inherit'
    },
    addEmailButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      backgroundColor: '#2563eb',
      color: 'white',
      marginLeft: '0.5rem'
    },
    loadingIndicator: {
      padding: '1rem',
      textAlign: 'center',
      color: '#6b7280'
    }
  };

  if (window.innerWidth >= 768) {
    styles.dashboardGrid.gridTemplateColumns = '1fr 1fr';
  }

  // Fetch emails from API
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/newsletter/emails');
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
        showNotification('Failed to load email list', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddEmail = () => {
    if (!emailInput) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    if (!emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput('');
    } else {
      showNotification('Email already in list', 'error');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };


const handleSend = async (schedule = false) => {
    if (!subject || !content || emails.length === 0) {
      showNotification('Please fill all required fields and add at least one recipient', 'error');
      return;
    }
  
    console.log("subject ", subject);
    console.log("content ", content);
    console.log("email ", emails);
  
    try {
      for (const email of emails) {
        const response = await fetch('http://localhost:8000/api/send-promotional-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject,
            content,
            email, 
          }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          console.error(`Failed to send to ${email}:`, result);
        }
      }
  
      showNotification(schedule ? 'Newsletter scheduled successfully!' : 'Newsletter sent successfully!');
      toast.success("Email successfully sent");
      
      // Clear form fields except emails
      // setSubject('');
      // setContent('');
      // setScheduledTime('');
    } catch (error) {
      console.error("Error sending emails:", error);
      showNotification('An error occurred while sending the newsletter.', 'error');
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'compose':
        return (
          <div style={styles.card}>
            {showPreview ? (
              <div style={styles.previewContainer}>
                <div style={styles.previewHeader}>
                  <h3 style={styles.previewTitle}>Newsletter Preview</h3>
                  <button 
                    onClick={() => setShowPreview(false)}
                    style={{...styles.button, ...styles.secondaryButton}}
                  >
                    Back to Edit
                  </button>
                </div>
                <div style={styles.previewContent}>
                  <div style={styles.previewSubject}>{subject || "(No subject)"}</div>
                  <div style={styles.previewBody}>{content || "(No content)"}</div>
                </div>
                <div style={{marginTop: '1rem'}}>
                  <div style={styles.label}>Recipients ({emails.length})</div>
                  <div style={styles.emailChipsContainer}>
                    {emails.map((email, index) => (
                      <div key={index} style={styles.emailChip}>
                        {email}
                        <button 
                          onClick={() => handleRemoveEmail(email)}
                          style={styles.removeEmailButton}
                          title="Remove email"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <div style={styles.typeToggle}>
                    <button 
                      onClick={() => setNewsletterType('promotional')}
                      style={{
                        ...styles.typeButton, 
                        ...styles.typeButtonLeft,
                        ...(newsletterType === 'promotional' ? styles.activeTypeButton : styles.inactiveTypeButton)
                      }}
                    >
                      Promotional
                    </button>
                    <button 
                      onClick={() => setNewsletterType('informational')}
                      style={{
                        ...styles.typeButton, 
                        ...styles.typeButtonRight,
                        ...(newsletterType === 'informational' ? styles.activeTypeButton : styles.inactiveTypeButton)
                      }}
                    >
                      Informational
                    </button>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subject Line*</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      style={styles.input}
                      placeholder="Enter newsletter subject"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Content*</label>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      style={{...styles.textarea, ...styles.contentTextarea}}
                      placeholder="Write your newsletter content here..."
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Recipients*</label>
                    {isLoading ? (
                      <div style={styles.loadingIndicator}>Loading email list...</div>
                    ) : (
                      <>
                        <div style={styles.emailInputContainer}>
                          <input 
                            type="email" 
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={styles.emailInput}
                            placeholder="Add email address"
                          />
                          <button 
                            onClick={handleAddEmail}
                            style={styles.addEmailButton}
                          >
                            Add
                          </button>
                        </div>
                        <div style={styles.emailChipsContainer}>
                          {emails.map((email, index) => (
                            <div key={index} style={styles.emailChip}>
                              {email}
                              <button 
                                onClick={() => handleRemoveEmail(email)}
                                style={styles.removeEmailButton}
                                title="Remove email"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          {emails.length === 0 && (
                            <div style={{color: '#6b7280', fontStyle: 'italic'}}>
                              No recipients added
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Schedule (optional)</label>
                    <input 
                      type="datetime-local" 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.buttonGroup}>
                    <button 
                      onClick={() => handleSend(false)}
                      style={{...styles.button, ...styles.primaryButton}}
                      disabled={isLoading}
                    >
                      Send Now
                    </button>
                    <button 
                      onClick={() => handleSend(true)}
                      style={{...styles.button, ...styles.successButton}}
                      disabled={isLoading}
                    >
                      Schedule
                    </button>
                    <button 
                      onClick={() => setShowPreview(true)}
                      style={{...styles.button, ...styles.secondaryButton}}
                      disabled={isLoading}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'history':
        return (
          <div style={{...styles.card, padding: 0, overflow: 'hidden'}}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableCellHeader}>Type</th>
                  <th style={styles.tableCellHeader}>Subject</th>
                  <th style={styles.tableCellHeader}>Status</th>
                  <th style={styles.tableCellHeader}>Date</th>
                  <th style={styles.tableCellHeader}>Recipients</th>
                  <th style={styles.tableCellHeader}>Performance</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map(newsletter => (
                  <tr key={newsletter.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.badge, 
                        ...(newsletter.type === 'promotional' ? styles.promoBadge : styles.infoBadge)
                      }}>
                        {newsletter.type === 'promotional' ? 'Promo' : 'Info'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{newsletter.subject}</td>
                    <td style={styles.tableCell}>
                      {newsletter.sent ? (
                        <span style={styles.sentStatus}>Sent</span>
                      ) : (
                        <span style={styles.scheduledStatus}>Scheduled for {newsletter.scheduled}</span>
                      )}
                    </td>
                    <td style={styles.tableCell}>{newsletter.date}</td>
                    <td style={styles.tableCell}>{newsletter.recipients || '—'}</td>
                    <td style={styles.tableCell}>
                      {newsletter.sent ? (
                        <span>
                          {newsletter.openRate} open • {newsletter.clickRate} click
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'analytics':
        return (
          <div style={styles.dashboardGrid}>
            <div style={styles.statsCard}>
              <h3 style={styles.statsTitle}>Newsletter Performance</h3>
              <div style={styles.statsContent}>
                <div style={styles.statsFlexContainer}>
                  <div style={styles.statsMetric}>
                    <div style={{...styles.statsValue, ...styles.statsBlue}}>42%</div>
                    <div style={styles.statsLabel}>Average Open Rate</div>
                  </div>
                  <div style={styles.statsDivider}></div>
                  <div style={styles.statsMetric}>
                    <div style={{...styles.statsValue, ...styles.statsGreen}}>18%</div>
                    <div style={styles.statsLabel}>Average Click Rate</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.statsCard}>
              <h3 style={styles.statsTitle}>Subscriber Growth</h3>
              <div style={styles.statsContent}>
                <div style={styles.statsMetric}>
                  <div style={{...styles.statsValue, ...styles.statsPurple}}>+{emails.length}</div>
                  <div style={styles.statsLabel}>Total Subscribers</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
         <Toaster position="top-right" richColors />
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <h1 style={styles.title}>Newsletter Management</h1>
        </div>
      </header>
      
      <div style={styles.mainContainer}>
        {notification && (
          <div style={{
            ...styles.notification, 
            ...(notification.type === 'error' ? styles.errorNotification : styles.successNotification)
          }}>
            {notification.message}
          </div>
        )}

        <div style={styles.tabContainer}>
          <button 
            onClick={() => setActiveTab('compose')}
            style={{
              ...styles.tabButton, 
              ...(activeTab === 'compose' ? styles.activeTabButton : styles.inactiveTabButton)
            }}
          >
            Compose Newsletter
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{
              ...styles.tabButton, 
              ...(activeTab === 'history' ? styles.activeTabButton : styles.inactiveTabButton)
            }}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{
              ...styles.tabButton, 
              ...(activeTab === 'analytics' ? styles.activeTabButton : styles.inactiveTabButton)
            }}
          >
            Analytics
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
}