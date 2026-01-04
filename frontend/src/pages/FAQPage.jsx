export default function FAQPage() {
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and also offer cash on delivery for select locations."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping usually takes 5-7 business days. Express shipping takes 2-3 business days. International shipping can take 10-15 business days depending on the destination."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused items in their original packaging. Please contact our customer service team to initiate a return. Custom items and sale items are final sale."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can check if we ship to your country during checkout."
    },
    {
      question: "How do I know if a product is in stock?",
      answer: "Product availability is shown on each product page. If an item is out of stock, you can sign up to be notified when it becomes available again."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 1 hour of placement. After that, please contact our customer service team as soon as possible for assistance."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes! We offer gift wrapping services for an additional fee. You can select this option during checkout and add a personalized message."
    },
    {
      question: "How do I care for my anime merchandise?",
      answer: "Care instructions vary by product type. Generally, we recommend hand washing delicate items and following the specific care labels on each product. Avoid direct sunlight and heat exposure."
    },
    {
      question: "Are your products officially licensed?",
      answer: "Yes! All our products are officially licensed anime merchandise from reputable manufacturers. We guarantee authenticity for all items sold."
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">Frequently Asked <span className="text-primary">Questions</span></h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <summary className="px-6 py-4 cursor-pointer font-semibold hover:text-primary transition flex justify-between items-center">
                  {faq.question}
                  <svg className="w-5 h-5 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-primary rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="mb-6">Can't find the answer you're looking for? Our customer service team is here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Contact Us
              </a>
              <a 
                href="mailto:support@animemerch.com" 
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}