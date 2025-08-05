import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  fileName: string;
  fileSize: number;
  docType: 'courtOrder' | 'policeReport';
  status: 'pending' | 'uploading' | 'success' | 'error';
  createdAt: Date;
}

const DocumentSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  docType: { type: String, enum: ['courtOrder', 'policeReport'], required: true },
  status: { type: String, enum: ['pending', 'uploading', 'success', 'error'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);