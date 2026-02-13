<?php
/**
 * Endpoint to set language cookie from frontend.
 * GET ?setlang=en|es|ru — sets cookie and returns 204. Cookie is set by server so it persists on HTTPS.
 */
$supportedLangs = ['en', 'es', 'ru'];
$lang = isset($_GET['setlang']) ? trim($_GET['setlang']) : '';

if ($lang !== '' && in_array($lang, $supportedLangs, true)) {
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
  setcookie('lang', $lang, [
    'expires' => time() + 31536000,
    'path' => '/',
    'secure' => $secure,
    'samesite' => 'Lax',
    'httponly' => false,
  ]);
}

header('HTTP/1.1 204 No Content');
exit;
