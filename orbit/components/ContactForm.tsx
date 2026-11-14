"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending"); setNote("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your message.");
      form.reset(); setStatus("sent"); setNote("Message received. Thank you for reaching out.");
    } catch (error) {
      setStatus("error"); setNote(error instanceof Error ? error.message : "Please try again later.");
    }
  }
  return <form className="public-contact-form" onSubmit={submit}>
    <div className="contact-form-grid">
      <label>Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
      <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>Company <span>(optional)</span><input name="company" maxLength={120} autoComplete="organization" /></label>
      <label>Role <span>(optional)</span><input name="role" maxLength={120} /></label>
      <label className="contact-wide">Subject<input name="subject" required minLength={3} maxLength={160} /></label>
      <label className="contact-wide">Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} /></label>
      <label className="contact-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "SEND MESSAGE ↗"}</button>
    {note && <p className={status === "error" ? "contact-feedback error" : "contact-feedback"} role="status">{note}</p>}
  </form>;
}
