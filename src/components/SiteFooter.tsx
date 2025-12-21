import {Container} from "@/components/Container";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[var(--ink)] text-white">
      <Container>
        <div className="py-10 text-sm text-white/70">
          © {new Date().getFullYear()} PRECON Design. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
