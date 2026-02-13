<?php
$page = isset($_REQUEST['page']) ? htmlspecialchars($_REQUEST['page']) : '';
$is_form = ($page === 'form');

// Language: cookie (user chose) → Accept-Language → default en
$supportedLangs = ['en', 'es', 'ru'];
$langDir = dirname(__DIR__) . '/lang/';
$pageLang = 'en';
$cookieLang = isset($_COOKIE['lang']) ? trim($_COOKIE['lang']) : '';
if ($cookieLang !== '' && in_array($cookieLang, $supportedLangs, true)) {
  $pageLang = $cookieLang;
} else {
  $accept = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '';
  foreach (preg_split('/[,;]/', $accept) as $part) {
    $code = strtolower(substr(trim(explode(';', $part)[0]), 0, 2));
    if (in_array($code, $supportedLangs, true)) {
      $pageLang = $code;
      break;
    }
  }
}
$dictEn = [];
if (is_file($langDir . 'en.json')) {
  $dictEn = (array) json_decode(file_get_contents($langDir . 'en.json'), true);
}
$dict = [];
if (is_file($langDir . $pageLang . '.json')) {
  $dict = (array) json_decode(file_get_contents($langDir . $pageLang . '.json'), true);
}
$dict = array_merge($dictEn, $dict);
function t($k) {
  global $dict;
  return isset($dict[$k]) ? htmlspecialchars($dict[$k]) : '';
}
if ($is_form) {
  $seo_title = 'Contact — Digilang';
  $seo_description = 'Get in touch with Digilang. Request a consultation for your website, design, or digital automation project.';
} else {
  $seo_title = null;
  $seo_description = null;
}
