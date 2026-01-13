<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digilang</title>
    <link rel="stylesheet" href="css/style.css?t=<?=time()?>">
</head>
<body>

<? include 'includes/header.php'; ?>

<div class="form_container">
   <div class="form_group">
        <div class="form_info">
            <h1 data-i18n="contacts">Contacts</h1>
            <a href="https://wa.me/541144724911"><h2>WhatsApp</h2></a>
            <h2>somemail@gmail.com</h2>
        </div>
        <form id="form_form">
            <input type="text" id="form_name" data-i18n-placeholder="plh_name">
            <input type="mail" id="form_mail" data-i18n-placeholder="plh_mail">
            <textarea name="message" id="form_message" data-i18n-placeholder="plh_message""></textarea>
            <button class="btn button_text" data-i18n="btn_send" style="cursor: pointer;" onclick=send(event)>Send</button>
        </form>
   </div>
</div>

<? include 'includes/footer.php'; ?>

<script src="/js/form.js"></script>
<script src="/js/i18n.js?v=1.0.3"></script>
</body>
</html>
