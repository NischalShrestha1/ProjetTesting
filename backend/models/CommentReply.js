import mongoose from "mongoose";

const commentReplySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Reply cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

export default commentReplySchema;
