import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Não autorizado" },
    { status: 401 }
  );
}

export function notFoundResponse(resource: string) {
  return NextResponse.json(
    { success: false, error: `${resource} não encontrado` },
    { status: 404 }
  );
}
