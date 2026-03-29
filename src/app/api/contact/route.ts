import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_CV_MB = 10;

function isValidEmail(v: string) {
  return /^\S+@\S+\.\S+$/.test(v);
}

function toText(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function mockId(prefix: "work" | "join") {
  return `${prefix}_${Date.now()}`;
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  try {
    // WORK / saradnja
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => null);

      if (!body || body.kind !== "work") {
        return jsonError("Bad request", 400);
      }

      const name = toText(body.name);
      const email = toText(body.email);
      const company = toText(body.company);
      const message = toText(body.message);

      if (!name || !email || !message) {
        return jsonError("Nedostaju obavezna polja.", 400);
      }

      if (!isValidEmail(email)) {
        return jsonError("Email nije validan.", 400);
      }

      // Za sada samo logujemo u server console, bez slanja email-a
      console.log("[CONTACT_DISABLED][WORK]", {
        name,
        email,
        company,
        message
      });

      return NextResponse.json({
        ok: true,
        disabled: true,
        id: mockId("work"),
        message: "Forma je uspešno primljena. Slanje email-a je trenutno isključeno."
      });
    }

    // CAREER / prijava sa CV-em
    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();

      const kind = String(fd.get("kind") || "");
      if (kind !== "join") {
        return jsonError("Bad request", 400);
      }

      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const position = String(fd.get("position") || "").trim();
      const letter = String(fd.get("letter") || "").trim();
      const cv = fd.get("cv");

      if (!name || !email || !letter) {
        return jsonError("Nedostaju obavezna polja.", 400);
      }

      if (!isValidEmail(email)) {
        return jsonError("Email nije validan.", 400);
      }

      if (!(cv instanceof File) || cv.size === 0) {
        return jsonError("CV fajl nedostaje.", 400);
      }

      if (cv.size > MAX_CV_MB * 1024 * 1024) {
        return jsonError(`CV je prevelik. Maksimum je ${MAX_CV_MB} MB.`, 413);
      }

      // Za sada samo logujemo osnovne podatke, bez slanja email-a
      console.log("[CONTACT_DISABLED][JOIN]", {
        name,
        email,
        position,
        letter,
        cvName: cv.name,
        cvSize: cv.size,
        cvType: cv.type
      });

      return NextResponse.json({
        ok: true,
        disabled: true,
        id: mockId("join"),
        message: "Prijava je uspešno primljena. Slanje email-a je trenutno isključeno."
      });
    }

    return jsonError("Unsupported content-type", 415);
  } catch (err) {
    console.error("Contact route error:", err);
    return jsonError("Došlo je do greške na serveru.", 500);
  }
}