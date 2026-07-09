import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  name: string;
  iconUrl: string;
  iconFileId: string;
  level: number; // 0-100
  order: number;
  category: string;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    iconUrl: { type: String, default: "" },
    iconFileId: { type: String, default: "" },
    level: { type: Number, default: 80, min: 0, max: 100 },
    order: { type: Number, default: 0 },
    category: { type: String, default: "Frontend" },
  },
  { timestamps: true }
);

// Force recompile during development hot-reloads
if (mongoose.models.Skill) {
  delete mongoose.models.Skill;
}

const Skill: Model<ISkill> = mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
