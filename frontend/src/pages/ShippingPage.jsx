export default function ShippingPage() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">Shipping & <span className="text-primary">Delivery</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domestic Shipping */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Domestic Shipping</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Standard</span>
                <span className="font-medium">5-7 days</span>
              </div>
              <div className="flex justify-between">
                <span>Express</span>
                <span className="font-medium">2-3 days</span>
              </div>
              <div className="flex justify-between">
                <span>Next Day</span>
                <span className="font-medium">1 day</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
              </div>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">International Shipping</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Standard</span>
                <span className="font-medium">10-15 days</span>
              </div>
              <div className="flex justify-between">
                <span>Express</span>
                <span className="font-medium">5-7 days</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Shipping to 100+ countries</p>
              </div>
            </div>
          </div>

          {/* Pickup Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Local Pickup</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Store Pickup</span>
                <span className="font-medium">1-2 days</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Available in Tokyo area</p>
                <p className="text-sm text-gray-600">Free of charge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order Value</th>
                  <th className="text-left py-3 px-4">Domestic</th>
                  <th className="text-left py-3 px-4">International</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Up to $25</td>
                  <td className="py-3 px-4">$4.99</td>
                  <td className="py-3 px-4">$12.99</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">$25 - $50</td>
                  <td className="py-3 px-4">$6.99</td>
                  <td className="py-3 px-4">$18.99</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">$50 - $100</td>
                  <td className="py-3 px-4">$8.99</td>
                  <td className="py-3 px-4">$24.99</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Over $100</td>
                  <td className="py-3 px-4">FREE</td>
                  <td className="py-3 px-4">$29.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Important Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Processing Time</h3>
              <p className="text-gray-600">Orders are typically processed within 1-2 business days. Custom items may take longer to process.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Tracking</h3>
              <p className="text-gray-600">All orders include tracking information. You'll receive an email once your order ships.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Customs & Duties</h3>
              <p className="text-gray-600">International orders may be subject to customs fees and import duties based on your country's regulations.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Damaged Items</h3>
              <p className="text-gray-600">If your order arrives damaged, please contact us within 48 hours for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}