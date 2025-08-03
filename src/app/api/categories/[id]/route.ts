import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { categoryUpdateSchema, generateSlug } from '@/lib/validations/category'
import { successResponse, errorResponse, handleError } from '@/lib/api-helpers'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/categories/[id] - Buscar categoria por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect()

    const category = await Category.findById(params.id).lean()
    
    if (!category) {
      return errorResponse('Category not found', 404)
    }

    return successResponse(category)

  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/categories/[id] - Atualizar categoria
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect()

    const body = await request.json()
    const validatedData = categoryUpdateSchema.parse(body)

    // Gerar novo slug se o name foi alterado
    if (validatedData.name && !validatedData.slug) {
      validatedData.slug = generateSlug(validatedData.name)
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    )

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    return successResponse(category, 'Category updated successfully')

  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/categories/[id] - Deletar categoria
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect()

    const category = await Category.findByIdAndDelete(params.id)

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    return successResponse(
      { id: params.id }, 
      'Category deleted successfully'
    )

  } catch (error) {
    return handleError(error)
  }
}
