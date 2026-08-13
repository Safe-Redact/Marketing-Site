import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, fileType, message } = body;

    // Validate required fields
    if (!name || !email || !fileType || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Integrate with your preferred backend
    // Options:
    // - Email service (SendGrid, Resend, Nodemailer)
    // - CRM API (HubSpot, Salesforce)
    // - Database (Supabase, PlanetScale)
    // - Webhook (Zapier, Make)
    //
    // Example with email:
    // await sendEmail({
    //   to: "support@saferedact.io",
    //   subject: `New quote request from ${name}`,
    //   body: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization}\nFile Type: ${fileType}\nMessage: ${message}`,
    // });

    console.log("Contact form submission:", { name, email, organization, fileType, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
