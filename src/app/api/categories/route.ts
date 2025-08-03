import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { categorySchema, categoryQuerySchema, generateSlug } from '@/lib/validations/category'
import { successResponse, errorResponse, handleError, checkMethod } from '@/lib/api-helpers'

// GET /api/categories - Lista todas as categorias (com filtros)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const queryParams = categoryQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || undefined,
      published: searchParams.get('published') || undefined,
    })

    // Construir filtros
    const filters: any = {}
    
    if (queryParams.published !== undefined) {
      filters.isPublished = queryParams.published === 'true'
    }
    
    if (queryParams.search) {
      filters.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } }
      ]
    }

    // Executar query com paginação
    const skip = (queryParams.page - 1) * queryParams.limit
    const [categories, total] = await Promise.all([
      Category.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(queryParams.limit)
        .lean(),
      Category.countDocuments(filters)
    ])

    const totalPages = Math.ceil(total / queryParams.limit)

    return successResponse({
      categories,
      pagination: {
        current: queryParams.page,
        total: totalPages,
        count: categories.length,
        totalCount: total
      }
    })

  } catch (error) {
    return handleError(error)
  }
}

// POST /api/categories - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Gerar slug se não fornecido
    if (!validatedData.slug) {
      validatedData.slug = generateSlug(validatedData.name)
    }

    const category = new Category(validatedData)
    await category.save()

    return successResponse(category, 'Category created successfully', 201)

  } catch (error) {
    return handleError(error)
  }
}
