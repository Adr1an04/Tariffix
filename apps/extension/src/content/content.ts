import cheerio from 'cheerio'

// Function to scrape product details quickly
const scrapeAmazonProduct = () => {
  const $ = cheerio.load(document.body.innerHTML)
  
  // Product title
  const title = $('#productTitle').text().trim()
  
  // Price
  const price = $('.a-price .a-offscreen').first().text().trim()
  
  // Product details table (technical specifications)
  const details: Record<string, string> = {}
  $('#productDetails_techSpec_section_1 tr').each((_, row) => {
    const key = $(row).find('th').text().trim().replace(/\s+/g, ' ')
    const value = $(row).find('td').text().trim().replace(/\s+/g, ' ')
    if (key && value) {
      details[key] = value
    }
  })
  
  // Additional details from the bottom section
  $('#productDetails_db_sections tr').each((_, row) => {
    const key = $(row).find('th').text().trim().replace(/\s+/g, ' ')
    const value = $(row).find('td').text().trim().replace(/\s+/g, ' ')
    if (key && value) {
      details[key] = value
    }
  })
  
  // Ratings
  const rating = $('#acrPopover').attr('title')?.replace(' out of 5 stars', '')
  const reviewCount = $('#acrCustomerReviewText').text().trim()
  
  return {
    title,
    price,
    rating,
    reviewCount,
    details
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeProduct') {
    const productData = scrapeAmazonProduct()
    sendResponse(productData)
  }
  return true // Required for async response
})