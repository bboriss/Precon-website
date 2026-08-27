import { Resend } from "resend";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ratelimit } from "@/utils/rateLimit";
import { getTranslations } from "next-intl/server";

import { CareerEmail } from "@/components/CareerContactTemplate";
import { GeneralEmail } from "@/components/GeneralContactTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const locale = req.headers.get("accept-language")?.split(",")[0] || "en";
  const t = await getTranslations({ locale, namespace: "contactModal.errors" });

  try {
    console.log("=== Sending Email Request Started ===");
    console.log("RESEND_API_KEY present:", Boolean(process.env.RESEND_API_KEY));
    console.log("CONTACT_EMAIL present:", Boolean(process.env.CONTACT_EMAIL));
    console.log("CONTACT_EMAIL value:", process.env.CONTACT_EMAIL);

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") ?? "anonymous";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      console.warn("Rate limit exceeded for IP:", ip);
      return NextResponse.json(
        { error: t("tooManyRequests") },
        { status: 429 },
      );
    }

    const body = await req.json();
    console.log("Request body parsed:", {
      email: body.email,
      name: body.name,
      type: body.type,
      hasMessage: Boolean(body.message),
      hasCv: Boolean(body.cv),
    });

    const { email, name, message, type, cv } = body;

    const title =
      type === "work"
        ? "New Message from Work Form"
        : "New Message from Career Form";

    const template =
      type === "career" ? (
        <CareerEmail
          name={name}
          email={email}
          position="N/A"
          message={message}
        />
      ) : (
        <GeneralEmail name={name} email={email} message={message} />
      );

    const attachments = [];
    if (type === "career" && cv) {
      const base64Content = cv.split(";base64,").pop();
      if (!base64Content) {
        console.error("Failed to parse base64 CV string");
      } else {
        attachments.push({
          filename: "CV.pdf",
          content: Buffer.from(base64Content, "base64"),
        });
      }
    }

    console.log("Calling Resend API...");

    const { data, error } = await resend.emails.send({
      from: `${title} <info@precondesign.rs>`,
      to: [process.env.CONTACT_EMAIL!],
      subject: `New Message from ${name}`,
      replyTo: email,
      text: message,
      react: template,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("Resend API error response:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unhandled error in POST /api/contact:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown internal server error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      { error: errorMessage, stack: errorStack },
      { status: 500 },
    );
  }
}
