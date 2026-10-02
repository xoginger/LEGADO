import { NextResponse } from "next/server";
import { patchDiskStore, readDiskStore } from "@legado/shared/disk";
import type {
  ChatMessage,
  ImportJob,
  ImportSourceState,
  LegadoProfile,
  Memory,
  Settings,
} from "@legado/shared";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(readDiskStore());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      memories?: Memory[];
      messages?: ChatMessage[];
      settings?: Settings;
      profile?: LegadoProfile;
      importSources?: ImportSourceState[];
      importJobs?: ImportJob[];
    };
    const next = patchDiskStore({
      ...(body.memories ? { memories: body.memories } : {}),
      ...(body.messages ? { messages: body.messages } : {}),
      ...(body.settings ? { settings: body.settings } : {}),
      ...(body.profile ? { profile: body.profile } : {}),
      ...(body.importSources ? { importSources: body.importSources } : {}),
      ...(body.importJobs ? { importJobs: body.importJobs } : {}),
    });
    return NextResponse.json(next);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo guardar el legado en disco." },
      { status: 500 },
    );
  }
}
