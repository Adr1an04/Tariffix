import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { getHtsCode, TariffEstimate } from '/Users/kaisprunger/tarrifix/TarrifFix/apps/extension/src/services/aiService.ts'
import { fetchTariffRates } from '/Users/kaisprunger/tarrifix/TarrifFix/apps/extension/src/services/tariffService.ts'

interface ProductData {
  title: string;
  manufacturer: string;
  countryOfOrigin: string;
  price: string;
  currency: string;
  url: string;
  website: string;
}

interface Rate {
  htsno: string;
  description: string;
  general: string;
  other: string;
  estimatedCost?: string;
}

const Popup = () => {
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [htsCode, setHtsCode] = useState<string | null>(null)
  const [htsLoading, setHtsLoading] = useState(false)
  const [rates, setRates] = useState<Rate[]>([])
  const [ratesLoading, setRatesLoading] = useState(false)
  const [tariffEstimate, setTariffEstimate] = useState<TariffEstimate | null>(null)

  // Cache for HTS codes and rates
  const [htsCache, setHtsCache] = useState<Record<string, string>>({})
  const [ratesCache, setRatesCache] = useState<Record<string, Rate[]>>({})

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
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
        
        if (response?.error) {
          setError(response.error)
        } else if (!response?.data) {
          setError('No data received from the page')
        } else {
          setProductData(response.data)
          // Start fetching HTS code immediately with manufacturer info
          fetchHtsCode(response.data.title, response.data.price, response.data.manufacturer)
        }
      } catch (err) {
        console.error('Error in popup:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [])

  const fetchHtsCode = async (productTitle: string, price?: string, manufacturer?: string) => {
    // Check cache first
    if (htsCache[productTitle]) {
      setHtsCode(htsCache[productTitle])
      fetchRates(htsCache[productTitle])
      return
    }

    setHtsLoading(true)
    try {
      const estimate = await getHtsCode(productTitle, price, manufacturer)
      setHtsCode(estimate.htsCode)
      setTariffEstimate(estimate)
      // Update cache
      setHtsCache(prev => ({ ...prev, [productTitle]: estimate.htsCode }))
      // Start fetching rates immediately
      fetchRates(estimate.htsCode)
    } catch (err) {
      console.error('Error getting HTS code:', err)
      setError(`Error getting HTS code: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setHtsLoading(false)
    }
  }

  const fetchRates = async (htsCode: string) => {
    if (!productData) return;
    
    setRatesLoading(true);
    try {
      const rates = await fetchTariffRates(
        htsCode,
        productData.title,
        productData.price,
        productData.currency
      );
      setRates(rates);
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError(`Error fetching rates: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setRatesLoading(false);
    }
  };

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
          <div className="info-row hts-code">
            <span className="info-label">HTS Code:</span>
            <span className="info-value">
              {htsLoading ? (
                <span className="loading-dots">Loading</span>
              ) : htsCode || 'Not found'}
            </span>
          </div>
        </div>

        {/* Tariff Rates Section */}
        <div className="tariff-rates">
          <h4 className="rates-title">Tariff Rates</h4>
          {renderTariffRates()}
        </div>
        
        <div className="product-url">
          <a href={productData.url} target="_blank" rel="noopener noreferrer">View on {productData.website}</a>
        </div>
      </div>
    )
  }

  const renderTariffRates = () => {
    if (ratesLoading) {
      return <div className="loading">Loading rates...</div>
    }

    if (rates.length > 0) {
      const rate = rates[0] // Use the first rate
      return (
        <div className="rate-item">
          <div className="tariff-calculation">
            <div className="calc-row">
              <span className="emoji">🧾</span>
              <span className="label">Retail Price:</span>
              <span className="value">{productData?.currency}{productData?.price}</span>
            </div>
            <div className="calc-row">
              <span className="emoji">💰</span>
              <span className="label">Estimated Tariff Portion:</span>
              <span className="value">{rate.estimatedCost}</span>
            </div>
            <div className="calc-row">
              <span className="emoji">📦</span>
              <span className="label">Base Price (pre-tariff):</span>
              <span className="value">
                {productData?.currency}
                {(parseFloat(productData?.price || '0') - parseFloat(rate.estimatedCost?.replace(/[^0-9.-]+/g, '') || '0')).toFixed(2)}
              </span>
            </div>
            <div className="tariff-info">
              Based on HTS {rate.htsno} @ {rate.general} tariff rate
            </div>
          </div>
        </div>
      )
    }

    // Show AI estimate when server is not available
    if (tariffEstimate) {
      return (
        <div className="rate-item ai-estimate">
          <div className="tariff-calculation">
            <div className="calc-row">
              <span className="emoji">🧾</span>
              <span className="label">Retail Price:</span>
              <span className="value">{tariffEstimate.retailPrice}</span>
            </div>
            <div className="calc-row">
              <span className="emoji">💰</span>
              <span className="label">Estimated Tariff Portion:</span>
              <span className="value">{tariffEstimate.tariffAmount}</span>
            </div>
            <div className="calc-row">
              <span className="emoji">📦</span>
              <span className="label">Base Price (pre-tariff):</span>
              <span className="value">{tariffEstimate.basePrice}</span>
            </div>
            <div className="tariff-info">
              Based on HTS {tariffEstimate.htsCode} @ {(parseFloat(tariffEstimate.generalRate) * 100).toFixed(0)}% tariff rate
              {tariffEstimate.countryOfOrigin && (
                <div className="origin-info">
                  <span className="emoji">🌍</span> Origin: {tariffEstimate.countryOfOrigin}
                  {tariffEstimate.countryOfOrigin === 'China' && (
                    <span className="section-301"> (includes Section 301 tariffs)</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="ai-warning">
            <span className="ai-icon">🤖</span>
            This is an AI-generated estimate. For official rates, ensure the server is running.
          </div>
        </div>
      )
    }

    return <div>No tariff rates available</div>
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
          <div className="loading-dots">Loading page data</div>
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
        .hts-code .info-value {
          font-family: monospace;
          font-size: 1.1em;
          font-weight: bold;
        }
        .tariff-rates {
          background-color: #f8f8f8;
          padding: 16px;
          border-radius: 8px;
        }
        .rates-title {
          margin: 0 0 12px 0;
          color: #0F1111;
          font-size: 16px;
        }
        .rates-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rate-item {
          background-color: white;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        .rate-header {
          font-family: monospace;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .rate-description {
          color: #555;
          font-size: 0.9em;
          margin-bottom: 8px;
        }
        .rate-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.9em;
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
        .loading-dots {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 20px;
        }
        .loading-dots:after {
          content: " .";
          animation: dots 1s steps(5, end) infinite;
        }
        @keyframes dots {
          0%, 20% {
            color: rgba(0,0,0,0);
            text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
          }
          40% {
            color: #666;
            text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
          }
          60% {
            text-shadow: .25em 0 0 #666, .5em 0 0 rgba(0,0,0,0);
          }
          80%, 100% {
            text-shadow: .25em 0 0 #666, .5em 0 0 #666;
          }
        }
        .ai-estimate {
          border-left: 4px solid #2196f3;
        }
        
        .ai-warning {
          margin-top: 8px;
          padding: 8px;
          background-color: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 4px;
          color: #0d47a1;
          font-size: 0.85em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .ai-icon {
          font-size: 1.2em;
        }
        
        .estimated-cost {
          margin-top: 8px;
          padding: 8px;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          font-weight: bold;
          color: #28a745;
        }
        
        .cost-explanation {
          margin-top: 4px;
          font-size: 0.85em;
          color: #666;
          font-weight: normal;
        }

        .tariff-calculation {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          background-color: white;
          border-radius: 8px;
        }

        .calc-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.1em;
        }

        .emoji {
          font-size: 1.2em;
          width: 24px;
          text-align: center;
        }

        .label {
          flex: 1;
          color: #555;
        }

        .value {
          font-family: monospace;
          font-weight: bold;
          color: #2196f3;
        }

        .tariff-info {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 0.9em;
          text-align: center;
        }

        .origin-info {
          margin-top: 8px;
          font-size: 0.9em;
          color: #555;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .section-301 {
          color: #d32f2f;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
createRoot(root).render(<Popup />)
