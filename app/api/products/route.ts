import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const sortBy   = searchParams.get('sortBy')  || 'Featured';
    const page     = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    
    // Prevent bot data overload by capping at 50 limit
    let rawLimit = parseInt(searchParams.get('limit') || '20');
    if (isNaN(rawLimit) || rawLimit <= 0) rawLimit = 20;
    const limit = Math.min(rawLimit, 50);
    
    const search   = searchParams.get('search');
    const ids      = searchParams.get('ids');

    const filter: Record<string, any> = {};
    if (category && category !== 'All') filter.category = category;
    if (search)                          filter.$text = { $search: search };
    if (ids) {
      const idArray = ids.split(',').filter(id => /^[0-9a-fA-F]{24}$/.test(id));
      if (idArray.length > 0) {
        filter._id = { $in: idArray };
      }
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      'Featured':           { isFeatured: -1, createdAt: -1 },
      'Newest':             { createdAt: -1 },
      'Price: Low to High': { price: 1 },
      'Price: High to Low': { price: -1 },
    };
    const sort = sortMap[sortBy] ?? sortMap['Featured'];
    const skip = (page - 1) * limit;

    const [dbProducts, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    const products = dbProducts.map(p => {
      const obj = p.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    const response = NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
