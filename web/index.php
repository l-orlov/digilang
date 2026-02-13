<? include 'includes/init.php'; ?>
<!DOCTYPE html>
<html lang="<?= $pageLang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($seo_title ?? 'Digilang — Digital solutions lab') ?></title>
    <?php include 'includes/seo_meta.php'; ?>
    <link rel="stylesheet" href="css/style.css?t=<?= time() ?>">
</head>
<body>

<?php
switch ($page) {
  case 'form':
    include 'includes/form.php';
    break;
  case 'landing':
  default:
    include 'includes/landing.php';
}
?>

</body>
</html>
