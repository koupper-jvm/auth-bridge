module.exports = {
    signIn(req, res) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            confirm_password: bcrypt.hashSync(req.body.confirmPassword, 10)
        });
    }
}