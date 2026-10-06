/** Text with inline links, rendered by joining strings and <a> elements. */
export type RichText = Array<string | { text: string; href: string }>;

export interface Link {
  label: string;
  href: string;
}
