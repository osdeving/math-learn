import { GET, POST } from '@/app/api/categories/route'
import { GET as getById, PUT, DELETE } from '@/app/api/categories/[id]/route'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'

// Mock da conexão MongoDB
jest.mock('@/lib/mongodb')
jest.mock('@/models/Category')

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>
const mockCategory = Category as jest.Mocked<typeof Category>

describe('/api/categories', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDbConnect.mockResolvedValue(undefined)
  })

  describe('GET /api/categories', () => {
    it('should return categories list', async () => {
      const mockCategories = [
        {
          _id: '1',
          name: 'Álgebra',
          description: 'Álgebra básica',
          slug: 'algebra',
          isPublished: true
        }
      ]

      mockCategory.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockCategories)
            })
          })
        })
      } as any)

      mockCategory.countDocuments.mockResolvedValue(1)

      const request = new Request('http://localhost:3000/api/categories?page=1&limit=10')
      const response = await GET(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.categories).toHaveLength(1)
      expect(data.data.pagination.total).toBe(1)
    })

    it('should filter by published status', async () => {
      mockCategory.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([])
            })
          })
        })
      } as any)

      mockCategory.countDocuments.mockResolvedValue(0)

      const request = new Request('http://localhost:3000/api/categories?published=true')
      await GET(request as any)

      expect(mockCategory.find).toHaveBeenCalledWith({
        isPublished: true
      })
    })
  })

  describe('POST /api/categories', () => {
    it('should create new category', async () => {
      const newCategory = {
        name: 'Geometria',
        description: 'Geometria euclidiana',
        isPublished: false
      }

      const savedCategory = {
        ...newCategory,
        _id: '123',
        slug: 'geometria',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockCategory.prototype.save = jest.fn().mockResolvedValue(savedCategory)

      const request = new Request('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Category created successfully')
    })

    it('should generate slug automatically', async () => {
      const newCategory = {
        name: 'Cálculo Diferencial',
        description: 'Cálculo com derivadas',
        isPublished: false
      }

      mockCategory.prototype.save = jest.fn().mockResolvedValue({
        ...newCategory,
        slug: 'calculo-diferencial'
      })

      const request = new Request('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      })

      await POST(request as any)

      expect(mockCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'calculo-diferencial'
        })
      )
    })

    it('should return validation error for invalid data', async () => {
      const invalidCategory = {
        name: '', // Nome vazio
        description: 'a'.repeat(501) // Muito longo
      }

      const request = new Request('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidCategory)
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Validation failed')
    })
  })
})

describe('/api/categories/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDbConnect.mockResolvedValue(undefined)
  })

  describe('GET /api/categories/[id]', () => {
    it('should return category by id', async () => {
      const mockCategory_data = {
        _id: '123',
        name: 'Álgebra',
        description: 'Álgebra básica',
        slug: 'algebra',
        isPublished: true
      }

      mockCategory.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCategory_data)
      } as any)

      const request = new Request('http://localhost:3000/api/categories/123')
      const response = await getById(request as any, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data._id).toBe('123')
    })

    it('should return 404 for non-existent category', async () => {
      mockCategory.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      } as any)

      const request = new Request('http://localhost:3000/api/categories/999')
      const response = await getById(request as any, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Category not found')
    })
  })
})
