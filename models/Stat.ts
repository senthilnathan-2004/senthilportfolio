import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStat extends Document {
  number: string;
  label: string;
  order: number;
}

const StatSchema = new Schema<IStat>(
  {
    number: { type: String, required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Stat: Model<IStat> =
  mongoose.models.Stat || mongoose.model<IStat>("Stat", StatSchema);

export default Stat;
