const { prisma } = require('../db/config.js');
const bcrypt = require('bcrypt');

const validate = async () => {
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password || email.trim()=='')
            return res.status(400).send('Bewakoof hai kya')
        const data = await prisma.user.findUnique({
            where:
                { email }
        })
        const hashedPassword = await bcrypt.hash(password, 10)
        if (!data)
            return res.status(400).send('user not found')
        if (data) {
            if (data.password != hashedPassword)
                return res.status(401).send('Wrong Password')
            return res.status(200).send('Access Granted')
        }
    })
}
module.exports = { validate }