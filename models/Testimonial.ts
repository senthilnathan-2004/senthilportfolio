import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  avatarFileId: string;
  quote: string;
  rating: number;
  order: number;
  isApproved: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    avatarFileId: { type: String, default: "" },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
