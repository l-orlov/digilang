async function send(e) {
    e.preventDefault()
    let url = "https://wa.me/541144724911?text="

    const name = form_name.value
    const mail = form_mail.value
    const message = form_message.value

    const dict = await getLangDict(getLang()) 

    if (name) {
        url += `${dict["name"]}: ` + name + '\n'
    }

    if (mail) {
        url += `${dict["mail"]}: ` + mail + '\n'
    }

    if (message) {
        url += `\n${message}`
    }

    window.location.href = encodeURI(url)
}