export default function ReturnsPage() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">Returns & <span className="text-primary">Exchanges</span></h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Return Policy */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Our Return Policy</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                we offer a straightforward return policy to make things right.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-700">
                  <strong>30-Day Return Window:</strong> You have 30 days from the date of delivery to return eligible items.
                </p>
              </div>
            </div>
          </div>

          {/* Eligible Items */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Eligible Items for Return</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-3">✓ Eligible for Return</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Unused items in original packaging</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Items with all tags attached</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Defective or damaged items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Wrong items shipped</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-red-600 mb-3">✗ Not Eligible for Return</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Used or worn items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Items without original packaging</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Custom orders or personalized items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Final sale items (marked at checkout)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">How to Return an Item</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Customer Service</h3>
                  <p className="text-gray-600">
                    Email us at support@animemerch.com or call +1 (555) 123-4567 with your order number and reason for return.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Receive Return Label</h3>
                  <p className="text-gray-600">
                    We'll email you a prepaid return shipping label within 24 hours of your request.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Package and Ship</h3>
                  <p className="text-gray-600">
                    Pack the item securely in its original packaging with all tags attached. Attach the return label and drop off at any shipping location.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Receive Refund</h3>
                  <p className="text-gray-600">
                    Once we receive and inspect the item (typically 3-5 business days), we'll process your refund to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Refund Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Refund Timeline</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Processing time: 3-5 business days</li>
                  <li>• Refund issued to original payment method</li>
                  <li>• Bank/credit card refunds may take 5-7 business days to appear</li>
                  <li>• PayPal refunds are typically instant</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Return Shipping Costs</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Free for defective or wrong items</li>
                  <li>• $4.99 deducted from refund for other returns</li>
                  <li>• Original shipping costs are non-refundable</li>
                  <li>• Free return label provided for all returns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Exchanges</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                We offer exchanges for the same item in a different size or color, subject to availability. 
                To request an exchange:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Follow the same return process as above</li>
                <li>Specify the size or color you'd like instead</li>
                <li>If the new item costs more, you'll pay the difference</li>
                <li>If the new item costs less, you'll receive a refund for the difference</li>
                <li>Exchange shipping is free for one-time exchanges</li>
              </ol>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-primary rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with a Return?</h2>
            <p className="mb-6">Our customer service team is here to assist you every step of the way.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@animemerch.com" 
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Email Support
              </a>
              <a 
                href="tel:+15551234567" 
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}