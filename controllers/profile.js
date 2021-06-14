const handleProfileGet = (req, res, db) => {
    const { id } = req.params;

    db.select("*").from('users').where({ id: id })
        .then(users => {
            if (users.length) {
                res.json(users[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json(err.detail))
}

module.exports = {
    handleProfileGet: handleProfileGet
};
