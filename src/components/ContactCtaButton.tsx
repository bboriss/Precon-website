"use client";

export default function ContactCtaButton({
  label,
  className = ""
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event("precon:open-contact"));
      }}
      className={className}
    >
      {label}
    </button>
  );
}