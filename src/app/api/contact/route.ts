import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@precondesign.rs";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "PRECON Website <website@precondesign.rs>";
const MAX_CV_MB = 10;

function isValidEmail(v: string) {
  return /^\S+@\S+\.\S+$/.test(v);
}

function toText(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function escapeHtml(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return jsonError("RESEND_API_KEY nije podešen na serveru.", 500);
  }

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

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeCompany = escapeHtml(company);
      const safeMessage = escapeHtml(message);

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        replyTo: email,
        subject: `Novi kontakt sa sajta — ${name}`,
        text: [
          "Novi upit sa sajta",
          "",
          `Ime i prezime: ${name}`,
          `Email: ${email}`,
          company ? `Kompanija: ${company}` : "",
          "",
          "Poruka:",
          message
        ]
          .filter(Boolean)
          .join("\n"),
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
            <h2 style="margin:0 0 16px">Novi upit sa sajta</h2>
            <p><strong>Ime i prezime:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${company ? `<p><strong>Kompanija:</strong> ${safeCompany}</p>` : ""}
            <p><strong>Poruka:</strong></p>
            <pre style="white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;background:#f6f6f6;padding:12px;border-radius:8px">${safeMessage}</pre>
          </div>
        `
      });

      if (error) {
        console.error("Resend work error:", error);
        return jsonError("Slanje poruke nije uspelo.", 500);
      }

      return NextResponse.json({ ok: true, id: data?.id });
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

      const attachmentBuffer = Buffer.from(await cv.arrayBuffer());

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safePosition = escapeHtml(position);
      const safeLetter = escapeHtml(letter);

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        replyTo: email,
        subject: `Nova prijava sa sajta — ${name}${position ? ` (${position})` : ""}`,
        text: [
          "Nova prijava sa sajta",
          "",
          `Ime i prezime: ${name}`,
          `Email: ${email}`,
          position ? `Pozicija: ${position}` : "",
          `CV fajl: ${cv.name}`,
          "",
          "Motivaciono pismo:",
          letter
        ]
          .filter(Boolean)
          .join("\n"),
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
            <h2 style="margin:0 0 16px">Nova prijava sa sajta</h2>
            <p><strong>Ime i prezime:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${position ? `<p><strong>Pozicija:</strong> ${safePosition}</p>` : ""}
            <p><strong>CV fajl:</strong> ${escapeHtml(cv.name)}</p>
            <p><strong>Motivaciono pismo:</strong></p>
            <pre style="white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;background:#f6f6f6;padding:12px;border-radius:8px">${safeLetter}</pre>
          </div>
        `,
        attachments: [
          {
            filename: cv.name,
            content: attachmentBuffer
          }
        ]
      });

      if (error) {
        console.error("Resend join error:", error);
        return jsonError("Slanje prijave nije uspelo.", 500);
      }

      return NextResponse.json({ ok: true, id: data?.id });
    }

    return jsonError("Unsupported content-type", 415);
  } catch (err) {
    console.error("Contact route error:", err);
    return jsonError("Došlo je do greške na serveru.", 500);
  }
}