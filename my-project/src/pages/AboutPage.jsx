export default function AboutPage() {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-anime mb-8 text-center">
            About <span className="text-primary">Us</span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                AnimeMerch was founded in 2020 by a group of passionate anime fans who wanted to create a one-stop shop for high-quality anime merchandise. 
              </p>
              <p className="text-gray-700">
                We work directly with licensed manufacturers to bring you authentic products featuring your favorite characters from Naruto, Dragon Ball, One Piece, Attack on Titan, and many more.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To provide anime fans with premium merchandise that celebrates their favorite shows and characters, while offering excellent customer service and fast shipping.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>100% Officially Licensed Products</li>
                <li>Fast Worldwide Shipping</li>
                <li>30-Day Money Back Guarantee</li>
                <li>Excellent Customer Support</li>
                <li>Exclusive Items You Won't Find Elsewhere</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }