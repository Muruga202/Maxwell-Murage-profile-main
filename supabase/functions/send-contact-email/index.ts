import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const sendEmail = async (payload: any) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, recipientEmail }: ContactFormRequest = await req.json();

    // Validate inputs
    if (!name || name.length > 100) {
      throw new Error("Name is required and must be less than 100 characters");
    }
    if (!email || email.length > 255 || !email.includes("@")) {
      throw new Error("Valid email is required");
    }
    if (!subject || subject.length > 200) {
      throw new Error("Subject is required and must be less than 200 characters");
    }
    if (!message || message.length > 2000) {
      throw new Error("Message is required and must be less than 2000 characters");
    }
    if (!recipientEmail || !recipientEmail.includes("@")) {
      throw new Error("Recipient email is invalid");
    }

    // Sanitize inputs to prevent injection
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim();
    const sanitizedSubject = subject.trim();
    const sanitizedMessage = message.trim();

    console.log(`Processing contact form from ${sanitizedEmail}`);

    // Send notification email to the website owner
    const notificationEmail = await sendEmail({
      from: "Contact Form <onboarding@resend.dev>",
      to: [recipientEmail],
      reply_to: sanitizedEmail,
      subject: `Contact Form: ${sanitizedSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${sanitizedName} (${sanitizedEmail})</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #3b82f6;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail.id);

    // Send confirmation email to the sender
    const confirmationEmail = await sendEmail({
      from: "Contact <onboarding@resend.dev>",
      to: [sanitizedEmail],
      subject: "Thank you for contacting us!",
      html: `
        <h1>Thank you for reaching out, ${sanitizedName}!</h1>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #3b82f6;">
          <p><strong>Your message:</strong></p>
          <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
        </div>
        <p style="margin-top: 30px;">Best regards,<br>The Team</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Emails sent successfully"
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
