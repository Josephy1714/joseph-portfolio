"use client";

import type { FormEvent } from "react";

type Props = { id: string; action: (formData: FormData) => void | Promise<void>; kind: "section" | "project"; };

export default function ConfirmDeleteForm({ id, action, kind }: Props) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Permanently delete this ${kind}? This cannot be undone.`)) event.preventDefault();
  }
  return <form action={action} onSubmit={confirmDelete}>
    <input type="hidden" name="id" value={id} />
    <button className="admin-danger" type="submit">Delete</button>
  </form>;
}
