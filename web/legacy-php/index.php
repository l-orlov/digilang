<?
$page = 'landing';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DigiLang</title>
    <link rel="icon" type="image/png" href="img/logo_icon.png">
    <link rel="shortcut icon" type="image/png" href="img/logo_icon.png">
    <link rel="apple-touch-icon" href="img/logo_icon.png">
    <meta name="description" content="We build websites and digitize your business. Web development, UX/UI design, WhatsApp &amp; Telegram bots, SEO, DevOps. Get a consultation.">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Digilang">
    <meta property="og:title" content="Digilang — Digital solutions lab | Websites, design, automation">
    <meta property="og:description" content="We build websites and digitize your business. Web development, UX/UI design, WhatsApp &amp; Telegram bots, SEO, DevOps.">
    <meta property="og:image" content="/img/logo.png">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="es_ES">
    <meta property="og:locale:alternate" content="ru_RU">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Digilang — Digital solutions lab | Websites, design, automation">
    <meta name="twitter:description" content="We build websites and digitize your business. Web development, UX/UI design, WhatsApp &amp; Telegram bots, SEO, DevOps.">
    <meta name="twitter:image" content="/img/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tektur&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<? include "includes/landing.php"; ?>

<script src="js/landing.js"></script>
<script>const currentPage = '<?= $page ?>';</script>
<script src="js/i18n.js"></script>
<script>document.addEventListener('DOMContentLoaded', () => initLang(currentPage));</script>
</body>
</html>
