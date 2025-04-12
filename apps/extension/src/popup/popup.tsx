import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface ProductData {
  pageType: string;
  title?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  url: string;
  error?: string;
}

const Popup = () => {
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Improved Amazon URL detection
        if (!tab?.url || !tab.url.match(/amazon\.(com|co\.uk|de|fr|it|es|co\.jp|in|ca|com\.mx|com\.br|com\.au|nl|pl|eg|sa|ae|se|sg|tr)/)) {
          setError('Please navigate to an Amazon page')
          setLoading(false)
          return
        }

        // Send message through the background script
        const response = await chrome.runtime.sendMessage({ action: 'getProductData' });
        console.log('Popup received response:', response);
        
        if (response?.error) {
          setError(response.error)
          setProductData(response)
        } else {
          setProductData(response)
        }
      } catch (err) {
        console.error('Error in popup:', err);
        setError(`Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [])

  const renderProductDetails = () => {
    if (!productData) return null

    if (productData.error) {
      return (
        <div className="non-product-page">
          <p className="error-message">{productData.error}</p>
          <p className="current-url">
            Current URL: <a href={productData.url} target="_blank" rel="noopener noreferrer">{productData.url}</a>
          </p>
        </div>
      )
    }

    return (
      <div className="product-details">
        <h3 className="product-title">{productData.title}</h3>
        
        <div className="product-info">
          <div className="info-row">
            <span className="info-label">Manufacturer:</span>
            <span className="info-value">{productData.manufacturer}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Country of Origin:</span>
            <span className="info-value">{productData.countryOfOrigin}</span>
          </div>
        </div>
        
        <div className="product-url">
          <a href={productData.url} target="_blank" rel="noopener noreferrer">View on Amazon</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      width: '400px', 
      padding: '16px', 
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <h2 style={{ 
        borderBottom: '1px solid #eee', 
        paddingBottom: '10px',
        marginBottom: '16px'
      }}>
        Amazon Product Info
      </h2>
      
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px'
        }}>
          <p>Loading page data...</p>
        </div>
      ) : error ? (
        <div style={{ 
          color: '#d32f2f',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <p>{error}</p>
        </div>
      ) : productData ? (
        renderProductDetails()
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          <p>No data found. Please navigate to an Amazon page.</p>
        </div>
      )}

      <style>{`
        .product-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .product-title {
          margin: 0;
          color: #0F1111;
          font-size: 18px;
        }
        .product-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: #f8f8f8;
          padding: 16px;
          border-radius: 8px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info-label {
          font-weight: bold;
          color: #555;
        }
        .info-value {
          color: #0F1111;
        }
        .product-url {
          text-align: center;
          margin-top: 16px;
        }
        .product-url a {
          color: #007185;
          text-decoration: none;
        }
        .product-url a:hover {
          color: #C7511F;
          text-decoration: underline;
        }
        .error-message {
          margin: 0 0 12px 0;
          color: #d32f2f;
        }
        .current-url {
          margin: 0;
          word-break: break-all;
        }
        .current-url a {
          color: #007185;
          text-decoration: none;
        }
        .current-url a:hover {
          color: #C7511F;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<Popup />)
}
