import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
