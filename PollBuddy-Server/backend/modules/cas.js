const CASAuthentication = require('cas-authentication')
const User = require('./routes/user')

const cas = new CASAuthentication({
	cas_url: process.env.CAS_URL || 'https://cas-auth.rpi.edu/cas',
	service_url: process.env.CAS_SERVICE_URL || "http://localhost:3000",
	cas_version: '3.0',
	renew: false
})

module.exports = {
	bounce: cas.bounce,
	block: cas.block,
	logout: cas.logout,
	async getUser(req){
		const rcs_id = req.session[cas.session_name]
		let user = await User.findOne({rcs_id: rcs_id})
		if(!user){
			user = new User({rcs_id: rcs_id})
			await user.save()
		}
		return user
	}
}