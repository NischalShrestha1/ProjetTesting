import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectCartItems, selectCartTotal, clearCart, selectUser } from '../store'
import { api } from '../config/api'

export default function PaymentModal({ onClose, user, onOrderSuccess }) {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartTotal)
  const shipping = 4.99
  const total = subtotal + shipping
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: user?.address || '',
    phone: user?.phone || ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Check if user is logged in before creating order
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to place an order')
        onClose()
        return
      }

      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize
        })),
        shippingAddress: {
          address: formData.billingAddress,
          phone: formData.phone
        },
        paymentMethod: paymentMethod === 'card' ? 'Card' : 'PayPal',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await api.post('/orders', orderData, config)
      console.log('Order created:', response.data)

      // Clear cart
      dispatch(clearCart())

      // Show success message
      const orderId = response.data.order?._id || response.data.order?.id || 'ORD-' + Date.now()
      alert(`Order placed successfully! Order ID: ${orderId}`)
      
      // Call success callback
      if (onOrderSuccess) {
        onOrderSuccess(response.data.order)
      }
      
      onClose()
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message)
      alert(`Payment failed: ${error.response?.data?.message || error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-pink-600 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>

        {/* Logo */}
        <p className="text-center text-3xl font-bold font-anime hover:text-primary transition mb-4">
          Anime<span className="text-primary">Merch</span>
        </p>

        <h2 className="text-center text-xl font-bold mb-4">Secure Payment</h2>

        {/* Order Summary */}
        <div className="bg-gray-800 rounded p-4 mb-4">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Payment Method */}
          <div>
            <label className="block mb-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2 rounded border ${
                  paymentMethod === 'card' 
                    ? 'border-primary bg-primary bg-opacity-20' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                💳 Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-2 rounded border ${
                  paymentMethod === 'paypal' 
                    ? 'border-primary bg-primary bg-opacity-20' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                🅿️ PayPal
              </button>
            </div>
          </div>

          {paymentMethod === 'card' ? (
            <>
              <div>
                <label className="block mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 bg-gray-800 rounded">
              <p className="mb-2">You will be redirected to PayPal to complete payment</p>
              <p className="text-sm text-gray-400">Total: ${total.toFixed(2)}</p>
            </div>
          )}

          <div>
            <label className="block mb-1">Billing Address</label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="123 Main St, City, State"
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 234 567 8900"
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-3 rounded disabled:opacity-50 flex items-center justify-center"
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                🔒 Pay ${total.toFixed(2)}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  )
}
