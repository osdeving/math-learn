'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface FormData {
  name: string
  description: string
  slug: string
  isPublished: boolean
}

interface FormErrors {
  name?: string
  description?: string
  slug?: string
  general?: string
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    slug: '',
    isPublished: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim()
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }))
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/categories')
      } else {
        if (data.errors) {
          const formErrors: FormErrors = {}
          data.errors.forEach((error: { field: string; message: string }) => {
            formErrors[error.field as keyof FormErrors] = error.message
          })
          setErrors(formErrors)
        } else {
          setErrors({ general: data.error })
        }
      }
    } catch (err) {
      setErrors({ general: 'Erro ao criar categoria' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nova Categoria</h1>
        <p className="text-muted-foreground">
          Crie uma nova categoria de matemática
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Categoria</CardTitle>
          <CardDescription>
            Preencha os dados da nova categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Álgebra Linear"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ex: Estudo de vetores, matrizes e transformações lineares"
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="Ex: algebra-linear"
                className={errors.slug ? 'border-red-500' : ''}
              />
              <p className="text-sm text-muted-foreground">
                URL amigável gerada automaticamente. Pode ser editada.
              </p>
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status de Publicação</Label>
              <div className="flex items-center space-x-4">
                <Badge 
                  variant={formData.isPublished ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                >
                  {formData.isPublished ? 'Publicado' : 'Rascunho'}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Clique para alternar entre publicado e rascunho
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link href="/admin/categories">
                  Cancelar
                </Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Categoria'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
