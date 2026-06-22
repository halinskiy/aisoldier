import { FooterEditorial } from "@ui-kit/components/section/FooterEditorial";

import copy from "@content/copy.json";

/**
 * S7b - Footer. The kit FooterEditorial with labeled columns (contract S7b):
 * oversized wordmark + three labeled link columns (Product / Open source /
 * NoCorny) + tagline + one legal line. External links carry target/rel. The
 * wordmark is the "NoCorny Tracer" text mark (the squiggle mark lives in the
 * nav). No invented "built with" line; everything here comes from copy.json.
 */
export function Footer() {
  const { footer } = copy;

  return (
    <FooterEditorial
      wordmark="NoCorny Tracer"
      tagline={footer.tagline}
      columns={footer.columns}
      legal={footer.legal}
    />
  );
}
