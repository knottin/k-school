import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const emailTemplatePath = path.join(process.cwd(), "emailTemplateEnquire.html");

const readEmailTemplate = () => {
  try {
    return fs.readFileSync(emailTemplatePath, "utf8");
  } catch (error) {
    console.error("Error reading email template file:", error);
    return "";
  }
};

async function validateEmailWithAbstract(email) {
  try {
    const res = await fetch(
      `https://emailreputation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`,
    );

    const data = await res.json();

    const deliverability = data.email_deliverability;
    const quality = data.email_quality;
    const risk = data.email_risk;

    if (!deliverability.is_format_valid) {
      return { valid: false, reason: "INVALID_FORMAT" };
    }

    if (deliverability.status !== "deliverable") {
      return { valid: false, reason: "UNDELIVERABLE_EMAIL" };
    }

    if (quality.is_disposable) {
      return { valid: false, reason: "DISPOSABLE_EMAIL" };
    }

    if (quality.is_role) {
      return { valid: false, reason: "ROLE_EMAIL" };
    }

    const warnings = [];
    if (quality.is_username_suspicious) warnings.push("SUSPICIOUS_USERNAME");
    if (risk.address_risk_status === "high") warnings.push("HIGH_RISK");
    if (quality.score < 40) warnings.push("LOW_SCORE");

    return { valid: true, warnings };
  } catch (err) {
    console.error("Abstract validation error:", err);
    return { valid: true };
  }
}

export async function POST(req) {
  const {
    parentName,
    email,
    mobileNumber,
    selectedPrograms,
    message,
    website,
  } = await req.json();

  if (website && website.trim() !== "") {
    return NextResponse.json(
      { message: "Enquiry sent successfully" },
      { status: 200 },
    );
  }

  if (
    !parentName ||
    !email ||
    !mobileNumber ||
    selectedPrograms.length === 0 ||
    !message
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  const emailCheck = await validateEmailWithAbstract(email);

  if (!emailCheck.valid) {
    const messages = {
      INVALID_FORMAT: "Please enter a valid email address.",
      DISPOSABLE_EMAIL:
        "Please use a permanent email address (temporary emails are not allowed).",
      UNDELIVERABLE:
        "This email address cannot receive emails. Please check and try again.",
      ROLE_EMAIL:
        "Please use a personal email address so we can contact you directly.",
    };

    return NextResponse.json(
      { error: messages[emailCheck.reason] || "Invalid email address." },
      { status: 400 },
    );
  }

  if (emailCheck.warnings?.length) {
    console.log("⚠️ Suspicious lead:", email, emailCheck.warnings);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    const emailTemplateSource = readEmailTemplate();
    const template = handlebars.compile(emailTemplateSource);

    const replacements = {
      parentName,
      email,
      mobileNumber,
      programs: selectedPrograms.join(", "),
      message,
    };
    const personalizedHtml = template(replacements);

    const mailOptions = {
      from: `"Knottin Website" <${process.env.EMAIL}>`,
      to: "knottin_schoolcare@live.com",
      subject: "New Enquiry Received",
      html: personalizedHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Enquiry sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
}
