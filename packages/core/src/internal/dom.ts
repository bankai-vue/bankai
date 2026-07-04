/**
 * HTML void elements — they can't contain children.
 * A polymorphic component that renders its default slot as children excludes these from its `as` prop.
 */
export type VoidElementTagName =
  | 'area'
  | 'base'
  | 'br'
  | 'col'
  | 'embed'
  | 'hr'
  | 'img'
  | 'input'
  | 'link'
  | 'meta'
  | 'param'
  | 'source'
  | 'track'
  | 'wbr';
