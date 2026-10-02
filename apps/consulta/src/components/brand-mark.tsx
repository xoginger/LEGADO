type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandMark({ size = 48, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/legado-mark.svg"
      alt="LEGADO"
      width={size}
      height={size}
      className={className ?? "legado-brand-mark"}
      decoding="async"
    />
  );
}
