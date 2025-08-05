import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Document from '@/models/Document';

export async function PUT(request: Request) {
  const id = request.url.split('/').pop();
  
  try {
    const body = await request.json();
    await dbConnect();
    
    const document = await Document.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!document) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: document });
  } catch (error) {
    console.error(`Error updating document ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const id = request.url.split('/').pop();

  try {
    await dbConnect();
    
    const deletedDocument = await Document.findByIdAndDelete(id);
    
    if (!deletedDocument) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}