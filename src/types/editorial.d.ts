// <rg-copy>: the editable copy element of Editorial Mode (local development
// only, components/venture/editorial). A custom element, so no site CSS rule
// for `span` matches it.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "rg-copy": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
