module.exports = {

    registerValidate: (req, res, next) => {
        const user = req.body;
        if (!user.name) {
            return res.send({message: "No username key", success: false, data: null});
        }
        if (user.name.length < 4 || user.name.length > 20)
            return res.send({message: "Username must be between 4 and 20 characters long", success: false, data: null});
        if (!user.passwordOne) {
            return res.send({message: "No passwordOne key", success: false, data: null});
        }
        if (!user.passwordTwo) {
            return res.send({message: "No passwordTwo key", success: false, data: null});
        }
        if (user.passwordOne < 4 || user.passwordOne > 20)
            return res.send({message: "Password must be between 4 and 20 characters long", success: false, data: null});

        const hasUppercase = /[A-Z]/.test(user.passwordOne);
        if (!hasUppercase) {
            return res.send({
                message: "Password must include at least one uppercase letter",
                success: false,
                data: null
            });
        }
        const hasSpecialSymbol = /[!@#$%^&*_+]/.test(user.passwordOne);
        if (!hasSpecialSymbol) {
            return res.send({
                message: "Password must include at least one special symbol (!@#$%^&*_+)",
                success: false,
                data: null
            });
        }


        if (user.passwordOne !== user.passwordTwo)
            return res.send({
                message: "Passwords do not match!",
                success: false,
                data: null
            });

        next()
    },
    loginValidate: (req, res, next) => {
        const {name, password} = req.body;

        if (!name) {
            return res.send({message: "No username key", success: false, data: null});
        }
        if (!password) {
            return res.send({message: "No password key", success: false, data: null});
        }

        if (name.length < 4 || name.length > 20)
            return res.send({message: "Bad credentials", success: false, data: null});

        if (password.length < 4 || password.length > 20)
            return res.send({
                message: "Bad credentials",
                success: false,
                data: null
            });
        const hasUppercase = /[A-Z]/.test(password);
        if (!hasUppercase) {
            return res.send({
                message: "Bad credentials",
                success: false,
                data: null
            });
        }
        const hasSpecialSymbol = /[!@#$%^&*_+]/.test(password);
        if (!hasSpecialSymbol) {
            return res.send({
                message: "Bad credentials",
                success: false,
                data: null
            });
        }

        next()
    },
    photoUrlValidate: (req, res, next) => {
        const {url} = req.body
        if (!url) {
            return res.send({message: "Url not found", success: false, data: null});
        }
        if (!url.includes("http")) {
            return res.send({message: "Image URL must contain http", success: false, data: null});
        }
        next()
    },
    newNameValidate: (req, res, next) => {
        const {name} = req.body
        if (!name) {
            return res.send({message: "New username not found", success: false, data: null});
        }
        if (name.length < 4 || name.length > 20)
            return res.send({message: "Username must be between 4 and 20 characters long", success: false, data: null});

        next()
    },
    newPasswordValidate: (req, res, next) => {
        const {oldPassword, newPassword} = req.body
        if (!oldPassword) {
            return res.send({message: "Old Password not found", success: false, data: null});

        }
        if (!newPassword) {
            return res.send({message: "New Password not found", success: false, data: null});

        }
        if ((oldPassword && (oldPassword.length < 4 || oldPassword.length > 20)) ||
            (newPassword && (newPassword.length < 4 || newPassword.length > 20))) {
            return res.send({ message: "Passwords must be between 4 and 20 characters long", success: false, data: null });
        }
        const oldHasUppercase = /[A-Z]/.test(oldPassword);
        if (!oldHasUppercase) {
            return res.send({
                message: "Old Password must include at least one uppercase letter",
                success: false,
                data: null
            });
        }
        const oldHasSpecialSymbol = /[!@#$%^&*_+]/.test(oldPassword);
        if (!oldHasSpecialSymbol) {
            return res.send({
                message: "Old Password must include at least one special symbol (!@#$%^&*_+)",
                success: false,
                data: null
            });
        }
        const hasUppercase = /[A-Z]/.test(newPassword);
        if (!hasUppercase) {
            return res.send({
                message: "New Password must include at least one uppercase letter",
                success: false,
                data: null
            });
        }
        const hasSpecialSymbol = /[!@#$%^&*_+]/.test(newPassword);
        if (!hasSpecialSymbol) {
            return res.send({
                message: "New Password must include at least one special symbol (!@#$%^&*_+)",
                success: false,
                data: null
            });
        }

        next()
    },
    newMessageValidate: (req, res, next) => {
        const {text} = req.body
        if (!text) {
            return res.send({message: "Message text not found", success: false, data: null});
        }
        if (text.length < 1 || text.length > 200)
            return res.send({message: "Text must be between 1 and 200 characters long", success: false, data: null});

        next()
    },


}