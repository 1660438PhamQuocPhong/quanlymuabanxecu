let formatRegister = (code) => {

	var html = ''
		html += '<div>'
		html += '<h3><b>Please verify your account</b></h3>'
		html += '<p>Link to: <a href="http://localhost:8080/verify='+ code +'">http://localhost:8080/verify='+ code +'</a></p>'
		html += '</div>'

	return html
}

let formatContactCustomer = () => {

	var html = ''
		html += '<div>'
		html += '<h3><b>Welcome to you!</b></h3>'
		html += '<p>Our store has the cars as you desire. You can go to our store to make a transaction</p>'
		html += '</div>'

	return html
}

module.exports = {
	formatRegister: formatRegister,
	formatContactCustomer: formatContactCustomer

}