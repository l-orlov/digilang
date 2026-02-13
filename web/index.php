<?php
$page = isset($_REQUEST['page']) ? htmlspecialchars($_REQUEST['page']) : '';
$is_form = ($page === 'form');
if ($is_form) {
  $seo_title = 'Contact — Digilang';
  $seo_description = 'Get in touch with Digilang. Request a consultation for your website, design, or digital automation project.';
} else {
  $seo_title = null;
  $seo_description = null;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($seo_title ?? 'Digilang — Digital solutions lab') ?></title>
    <?php include 'includes/seo_meta.php'; ?>
    <link rel="stylesheet" href="css/style.css?t=<?=time()?>">
    <style>body{visibility:hidden}html.i18n-ready body{visibility:visible}</style>
</head>
<body>

<?

SWITCH ( $page ) {
    case 'form':	    include "includes/form.php";        break;
    case 'landing': 
    default:			include "includes/landing.php";
}
?>

</body>
</html>
