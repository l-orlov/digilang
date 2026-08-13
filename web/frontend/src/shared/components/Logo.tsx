/**
 * Marca de DigiLang: una captura real del objeto facetado del hero
 * (mismo icosaedro/material que HeroScene.tsx — no una aproximación plana
 * dibujada aparte), en vez del bombillo azul fotorrealista del sitio
 * anterior. El wordmark es texto real (fuente Tektur del sitio), no una
 * imagen — siempre nítido.
 */
interface LogoProps {
  withText?: boolean;
  withIcon?: boolean;
  size?: number;
  className?: string;
}

export function Logo({ withText = true, withIcon = true, size = 28, className }: LogoProps) {
  return (
    <span className={`dl-logo${className ? ` ${className}` : ''}`}>
      {withIcon && (
        <img
          src="/img/logo-mark.png"
          alt=""
          width={size}
          height={size}
          className="dl-logo__mark"
          style={{ width: size, height: size }}
        />
      )}
      {withText && <span className="dl-logo__text">DigiLang</span>}
    </span>
  );
}
