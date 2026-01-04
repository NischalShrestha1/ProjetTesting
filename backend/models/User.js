import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    trim: true,
    default: ''
  },
  lastname: { 
    type: String, 
    trim: true,
    default: ''
  },
  username: { 
    type: String, 
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  address: { 
    type: String,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: function() {
      // Auto-set admin status for admin usernames
      return this.username && this.username.toLowerCase().includes('admin');
    }
  }
}, { timestamps: true });

// Password hashing
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
