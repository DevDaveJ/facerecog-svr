const handleSignin = (bcrypt, db) => (req, res) => {
    db.select('*').from('login')
        .where('email','=',req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

            if (isValid) {
                return db.select("*").from('users')
                    .where('email','=',req.body.email)
                    .then(user => {
                        const rtn = { data: user, mesg: ''}
                        res.json(rtn)
                    })
                    .catch(err => {
                        const rtn = { data: [], mesg: err.detail}
                        res.status(400).json(rtn)
                    })
            } else {
                const rtn = { data: [], mesg: "Invalid credentials"}
                res.status(400).json(rtn)
            }
        })
        .catch(err => {
            const rtn = { data: [], mesg: "Wrong credentials" }
            res.status(400).json(rtn)
        })
}

module.exports = {
    handleSignin: handleSignin
}