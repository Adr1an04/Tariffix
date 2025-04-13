import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface ProductData {
  title: string;
  manufacturer: string;
  countryOfOrigin: string;
  price: string;
  currency: string;
  url: string;
  website: string;
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
        
        // Check if URL is from a supported website
        if (!tab?.url) {
          setError('No active tab found')
          setLoading(false)
          return
        }

        const isAmazonUrl = tab.url.match(/amazon\.(com|co\.uk|de|fr|it|es|co\.jp|in|ca|com\.mx|com\.br|com\.au|nl|pl|eg|sa|ae|se|sg|tr)/);
        const isWalmartUrl = tab.url.match(/walmart\.com/);

        if (!isAmazonUrl && !isWalmartUrl) {
          setError('Please navigate to an Amazon or Walmart page')
          setLoading(false)
          return
        }

        // Send message through the background script
        const response = await chrome.runtime.sendMessage({ action: 'getProductData' });
        console.log('Popup received response:', response);
        
        if (response?.error) {
          setError(response.error)
        } else if (!response?.data) {
          setError('No data received from the page')
        } else {
          setProductData(response.data)
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

    return (
      <div className="product-details">
        <h3 className="product-title">{productData.title}</h3>
        
        <div className="product-info">
          <div className="info-row">
            <span className="info-label">Manufacturer:</span>
            <span className="info-value">{productData.manufacturer || 'Not found'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Country of Origin:</span>
            <span className="info-value">{productData.countryOfOrigin || 'Not found'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Price:</span>
            <span className="info-value">{productData.price ? `${productData.currency}${productData.price}` : 'Not found'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Website:</span>
            <span className="info-value">{productData.website}</span>
          </div>
        </div>
        
        <div className="product-url">
          <a href={productData.url} target="_blank" rel="noopener noreferrer">View on {productData.website}</a>
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
        Product Info
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
          <p>No data found. Please navigate to a supported product page.</p>
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
          line-height: 1.4;
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
          align-items: flex-start;
          gap: 16px;
        }
        .info-label {
          font-weight: bold;
          color: #555;
          flex-shrink: 0;
          min-width: 120px;
        }
        .info-value {
          color: #0F1111;
          text-align: right;
          word-break: break-word;
        }
        .product-url {
          text-align: center;
          margin-top: 16px;
        }
        .product-url a {
          color: #007185;
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid #007185;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .product-url a:hover {
          color: #fff;
          background-color: #007185;
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<Popup />)
}
