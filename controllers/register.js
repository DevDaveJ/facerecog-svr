const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission')
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({ 
            email: email, 
            hash: hash 
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('loginEmail: ',loginEmail);
            
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }) 
                .then(user => {
                    const rtn = { data: user, mesg: ''}
                    res.json(rtn)
                })
                .catch(err => { 
                    const rtn = { data: [], mesg: 'Unable to register #2, sorry. '+err}
                    res.status(400).json(rtn) 
                })  
            })
        .then(trx.commit)
        .catch(trx.rollback)
    })  
    .catch(err => { 
        const rtn = { data: [], mesg: 'Unable to register #1, sorry. '+err}
        res.status(400).json(rtn) 
    })  
}

module.exports = {
    handleRegister: handleRegister
}