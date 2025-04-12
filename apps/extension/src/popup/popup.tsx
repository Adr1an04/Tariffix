import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const Popup = () => {
  const [productData, setProductData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    chrome.runtime.sendMessage({ action: 'getProductData' }, (response) => {
      setProductData(response)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ width: '300px', padding: '16px' }}>
      <h2>Amazon Product Scraper</h2>
      {loading ? (
        <p>Loading product data...</p>
      ) : productData ? (
        <div>
          <h3>{productData.title}</h3>
          <p><strong>Price:</strong> {productData.price}</p>
          <p><strong>Rating:</strong> {productData.rating} ({productData.reviewCount})</p>
          <h4>Product Details:</h4>
          <ul>
            {Object.entries(productData.details).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value as string}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No product data found. Navigate to an Amazon product page.</p>
      )}
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<Popup />)
}