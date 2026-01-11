import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { 
  selectCartItems, 
  selectCartTotal, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  selectUser 
} from '../store'
import PaymentModal from '../components/PaymentModal'
import { useState } from 'react'

export default function CartPage({ setShowAuthModal }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectUser);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const updateQuantity = (id, quantity, selectedSize) => {
    dispatch(updateCartItem({ id, quantity, selectedSize }));
  }

  const removeItem = (id, selectedSize) => {
    dispatch(removeFromCart({ id, selectedSize }));
  }
  
  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Check if profile is complete
      if (!user.firstname || !user.lastname || !user.email || !user.address || !user.phone) {
        alert('Please complete your profile information (first name, last name, email, address, and phone) before checkout.');
        return;
      }
      setShowPaymentModal(true);
    }
  }
  
  const handleOrderSuccess = (order) => {
    // Order was successful, cart is cleared, user is notified
    console.log('Order successful:', order);
  }
  
  const shipping = 4.99
  const total = subtotal + shipping

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-anime mb-8">Your <span className="text-primary">Cart</span></h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link 
              to="/" 
              className="bg-primary hover:bg-pink-600 text-white font-bold py-2 px-6 rounded inline-block transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 font-bold">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                
                {cart.map(item => (
                  <div key={item._id || item.id} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                    <div className="col-span-6 flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        {item.selectedSize && (
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        <button 
                          onClick={() => removeItem(item._id || item.id, item.selectedSize)}
                          className="text-red-500 text-sm hover:underline mt-2 block"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">${item.price.toFixed(2)}</div>
                    
                    <div className="col-span-2 flex justify-center">
                      <div className="flex border border-gray-300 rounded">
                        <button 
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1, item.selectedSize)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1, item.selectedSize)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 px-6 rounded transition"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
                
                <Link 
                  to="/" 
                  className="block text-center mt-4 text-primary hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            onClose={() => setShowPaymentModal(false)}
            user={user}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </div>
    </section>
  )
}