import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  icon: string; // Lucide icon name
  title: string;
  description: string;
  order: number;
}

const ServiceSchema = new Schema<IService>(
  {
    icon: { type: String, default: "Code2" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);

export default Service;
