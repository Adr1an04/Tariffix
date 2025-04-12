import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface ProductData {
  pageType: string;
  title?: string;
  price?: string;
  rating?: string;
  reviewCount?: string;
  availability?: string;
  seller?: string;
  mainImage?: string;
  url: string;
  details?: Record<string, string>;
  error?: string;
}

const Popup = () => {
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductData = () => {
      setLoading(true)
      setError(null)
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.url?.includes('amazon.com')) {
          setError('Please navigate to an Amazon page')
          setLoading(false)
          return
        }
        
        chrome.runtime.sendMessage({ action: 'getProductData' }, (response) => {
          if (chrome.runtime.lastError) {
            setError(`Error: ${chrome.runtime.lastError.message}`)
          } else if (response?.error) {
            setError(response.error)
            setProductData(response)
          } else {
            setProductData(response)
          }
          setLoading(false)
        })
      })
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
        {productData.mainImage && (
          <div className="product-image">
            <img src={productData.mainImage} alt={productData.title} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
        
        <h3 className="product-title">{productData.title}</h3>
        
        <div className="product-info">
          {productData.price && <p><strong>Price:</strong> {productData.price}</p>}
          {productData.rating && <p><strong>Rating:</strong> {productData.rating} {productData.reviewCount && `(${productData.reviewCount})`}</p>}
          {productData.availability && <p><strong>Availability:</strong> {productData.availability}</p>}
          {productData.seller && <p><strong>Seller:</strong> {productData.seller}</p>}
        </div>
        
        <div className="product-specs">
          <h4>Product Details:</h4>
          {productData.details && Object.keys(productData.details).length > 0 ? (
            <ul>
              {Object.entries(productData.details).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          ) : (
            <p>No detailed specifications found.</p>
          )}
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
        Amazon Product Scraper
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
        .product-image {
          text-align: center;
          margin-bottom: 16px;
        }
        .product-title {
          margin: 0;
          color: #0F1111;
          font-size: 18px;
        }
        .product-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .product-specs {
          border-top: 1px solid #eee;
          padding-top: 16px;
        }
        .product-specs h4 {
          margin: 0 0 12px 0;
        }
        .product-specs ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
