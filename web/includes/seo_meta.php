<?php
/**
 * SEO meta for bots (search engines, social crawlers).
 * Optional: set $seo_title, $seo_description, $seo_image, $seo_canonical before including.
 * $base_url = (e.g. https://example.com) used for canonical and og:image if not set.
 */
if (!isset($base_url) || $base_url === '') {
  $protocol = 'http';
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    $protocol = 'https';
  } elseif (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $protocol = 'https';
  }
  $base_url = $protocol . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}
$seo_site_name = $seo_site_name ?? 'Digilang';
$seo_title = $seo_title ?? 'Digilang — Digital solutions lab | Websites, design, automation';
$seo_description = $seo_description ?? 'We build websites and digitize your business. Web development, UX/UI design, WhatsApp & Telegram bots, SEO, DevOps. Get a consultation.';
$seo_image = $seo_image ?? ($base_url . '/img/logo.png');
$seo_canonical = $seo_canonical ?? $base_url . ($_SERVER['REQUEST_URI'] ?? '/');
$seo_type = $seo_type ?? 'website';
?>
<meta name="description" content="<?= htmlspecialchars($seo_description) ?>">
<meta name="robots" content="index, follow">
<?php if ($seo_canonical): ?>
<link rel="canonical" href="<?= htmlspecialchars($seo_canonical) ?>">
<?php endif; ?>

<!-- Open Graph (Facebook, Telegram, LinkedIn, etc.) -->
<meta property="og:type" content="<?= htmlspecialchars($seo_type) ?>">
<meta property="og:site_name" content="<?= htmlspecialchars($seo_site_name) ?>">
<meta property="og:title" content="<?= htmlspecialchars($seo_title) ?>">
<meta property="og:description" content="<?= htmlspecialchars($seo_description) ?>">
<?php if ($seo_image): ?>
<meta property="og:image" content="<?= htmlspecialchars($seo_image) ?>">
<?php endif; ?>
<?php if ($seo_canonical): ?>
<meta property="og:url" content="<?= htmlspecialchars($seo_canonical) ?>">
<?php endif; ?>
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="es_ES">
<meta property="og:locale:alternate" content="ru_RU">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= htmlspecialchars($seo_title) ?>">
<meta name="twitter:description" content="<?= htmlspecialchars($seo_description) ?>">
<?php if ($seo_image): ?>
<meta name="twitter:image" content="<?= htmlspecialchars($seo_image) ?>">
<?php endif; ?>

<?php if (empty($seo_skip_jsonld)): ?>
<script type="application/ld+json">
<?= json_encode([
  '@context' => 'https://schema.org',
  '@type' => 'Organization',
  'name' => $seo_site_name,
  'description' => $seo_description,
  'url' => $seo_canonical,
  'logo' => $seo_image ?: null
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>
</script>
<?php endif; ?>
