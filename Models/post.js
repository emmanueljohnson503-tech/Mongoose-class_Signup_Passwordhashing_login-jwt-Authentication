const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  media: [{
   imageUrl: {type: String, required: true},
   imageId: {type: String, required: true}
  }],
 
}, {
    timestamps: true
});

const postModel = mongoose.model('post', postSchema)

module.exports = postModel