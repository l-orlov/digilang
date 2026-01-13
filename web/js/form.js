function send(e) {
    e.preventDefault()
    let url = "https://wa.me/541144724911?text="

    const name = form_name.value
    const mail = form_mail.value
    const message = form_message.value

    if (message)
        url += message + '\n\n'
    if (name && mail)
        url += `${name} ${mail}`
    else if (name)
        url += name
    else if (mail)
        url += mail

    window.location.href = encodeURI(url)
}