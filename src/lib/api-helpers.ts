import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Tipos para responses padronizadas
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

// Função para respostas de sucesso
export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): NextResponse {
    return NextResponse.json(
        {
            success: true,
            data,
            message,
        } as ApiResponse<T>,
        { status }
    );
}

// Função para respostas de erro
export function errorResponse(
    message: string,
    status: number = 400,
    errors?: Array<{ field: string; message: string }>
): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error: message,
            errors,
        } as ApiResponse,
        { status }
    );
}

// Handler para erros de validação Zod
export function handleZodError(error: ZodError): NextResponse {
    const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));

    return errorResponse("Validation failed", 400, errors);
}

// Handler genérico para erros
export function handleError(error: unknown): NextResponse {
    console.error("API Error:", error);

    if (error instanceof ZodError) {
        return handleZodError(error);
    }

    if (error instanceof Error) {
        // MongoDB duplicate key error
        if (error.message.includes("E11000")) {
            return errorResponse("Resource already exists", 409);
        }

        return errorResponse(error.message, 500);
    }

    return errorResponse("Internal server error", 500);
}

// Verificação de métodos HTTP permitidos
export function checkMethod(
    request: Request,
    allowedMethods: string[]
): NextResponse | null {
    if (!allowedMethods.includes(request.method!)) {
        return errorResponse(`Method ${request.method} not allowed`, 405);
    }
    return null;
}
