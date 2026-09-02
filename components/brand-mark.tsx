export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="sbgUVV, AWS Student Builder Group UVV">
      <a
        className="brand-logo-link"
        href="https://www.instagram.com/aws.sbg.uvv/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram do sbgUVV (abre em nova aba)"
      >
        <img className="brand-logo" src="/brand/sbguvv-logo.svg" alt="sbgUVV" />
      </a>
      {!compact && <span className="brand-divider" aria-hidden="true" />}
      <span className="brand-name">AWS Student Builder Group</span>
      <span className="uvv-badge">UVV</span>
    </div>
  );
}
