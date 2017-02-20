import mongoose from 'mongoose';

var TestWriteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export {TestWriteSchema};