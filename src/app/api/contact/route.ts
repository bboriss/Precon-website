import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  // Work together (JSON)
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);

    if (!body || body.kind !== "work") {
      return new NextResponse("Bad request", { status: 400 });
    }

    const { name, email, company, message } = body as {
      name: string;
      email: string;
      company?: string;
      message: string;
    };

    if (!name || !email || !message) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // TODO: send email / store
    return NextResponse.json({ ok: true });
  }

  // Join us (multipart/form-data with file)
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();

    const kind = String(fd.get("kind") || "");
    if (kind !== "join") return new NextResponse("Bad request", { status: 400 });

    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const position = String(fd.get("position") || "");
    const letter = String(fd.get("letter") || "");
    const cv = fd.get("cv");

    if (!name || !email || !letter) {
      return new NextResponse("Missing fields", { status: 400 });
    }
    if (!(cv instanceof File) || cv.size === 0) {
      return new NextResponse("Missing CV file", { status: 400 });
    }

    // server-side guard
    const maxMB = 10;
    if (cv.size > maxMB * 1024 * 1024) {
      return new NextResponse("CV too large", { status: 413 });
    }

    // TODO: send email with attachment / upload to storage
    // const bytes = await cv.arrayBuffer(); // if you need raw bytes
    // const filename = cv.name;

    return NextResponse.json({ ok: true });
  }

  return new NextResponse("Unsupported content-type", { status: 415 });
}
