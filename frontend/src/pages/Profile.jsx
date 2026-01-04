import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateUserProfile, logout as userLogout, selectUser } from '../store'

export default function Profile({ onLogout }) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    address: '',
    phone: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setUser({
        email: currentUser.email || '',
        username: currentUser.username || '',
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        address: currentUser.address || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      await dispatch(updateUserProfile({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        phone: user.phone
      })).unwrap();

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(userLogout());
      navigate('/')
      if (onLogout) {
        onLogout()
      }
    } catch (err) {
      console.error('Logout error:', err)
      // Force logout even if there's an error
      dispatch(userLogout());
      navigate('/')
      if (onLogout) {
        onLogout()
      }
    }
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold font-anime mb-6 text-center">
          Profile <span className="text-primary">Settings</span>
        </h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled
            />
            <small className="text-gray-500">Email cannot be changed</small>
          </div>

          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Address</label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}