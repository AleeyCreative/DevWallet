function get(elem) {
    return document.querySelector(elem)
}

//handling the menu-links
var connected = "<div class='green-text mdi mdi-checkbox-marked-circle-outline'> Connected </div>"
var error = "<div class='red-text mdi mdi-alert'> No connection </div>"
var message = get(".msg")

var links = document.querySelectorAll("a")
var url = "www.test.com"
var dialog = get("dialog")
links.forEach(link => {
    link.onclick = function (e) {
        e.preventDefault()
        fetch(url)
            .then(res => {
                console.log(res)
                console.log(this.href)
                window.location.replace(this.href)
            })
            .catch(err => {
                message.innerHTML = error
            })
    }
})
