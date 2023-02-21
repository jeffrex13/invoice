const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {}

userController.register = async (req, res) => {
	try {
		const { username, password, name } = req.body

		const existingUser = await User.findOne({ username })
		if (existingUser) {
			return res.status(400).json({ message: 'Username already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const user = new User({
			username,
			password: hashedPassword,
			name
		})

		await user.save()

		res.status(201).json({ message: 'User created successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

userController.login = async (req, res) => {
	try {
		const { username, password } = req.body

		const user = await User.findOne({ username })
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

		res.status(200).json({ token })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

module.exports = userController
