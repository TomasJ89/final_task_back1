const userDb = require("../schemas/userSchema")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


module.exports = {
    register: async (req, res) => {
        const {passwordOne, name} = req.body;

        const userExist = await userDb.findOne({username: name})

        if (userExist) {
            return res.send({message: "Username already taken", success: false, data: null});
        }

        const salt = await bcrypt.genSalt(10)

        const passHash = await bcrypt.hash(passwordOne, salt)


        const user = new userDb({
            username: name,
            password: passHash,
            image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        });
        await user.save();
        return res.send({message: "Register successfully", success: true, data: null});
    },
    login: async (req, res) => {
        const {password, name} = req.body;

        const user = await userDb.findOne({username: name})
        if (!user) {
            return res.send({message: "user not found", success: false, data: null});
        }

        const passValid = await bcrypt.compare(password, user.password)
        if (passValid) {

            const newUser = {
                id: user._id,
                username: user.username,
            }

            const token = jwt.sign(newUser, process.env.JWT_SECRET)

            newUser.image = user.image
            newUser.conversations = user.conversations

            return res.send({message: "Login success", success: true, token, data: newUser});
        } else {

            return res.send({message: "Passwords do not match", success: false, data: null});
        }

    },
    updatePhoto: async (req, res) => {
        const {url, user} = req.body
        let updatedUser = await userDb.findOneAndUpdate(
            {_id: user.id},
            {image: url},
            {new: true, projection: {password: 0}}
        );

        res.send({message: "Photo updated", success: true, data: updatedUser});
    },
    updateUserName: async (req, res) => {
        const {name, user} = req.body
        const userExist = await userDb.findOne({username: name})

        if (userExist) {
            return res.send({message: `Username ${name} already taken`, success: false, data: null});
        }

        const updatedUser = await userDb.findOneAndUpdate(
            {_id: user.id},
            {username: name},
            {new: true, projection: {password: 0}}
        );

        res.send({message: "Username updated", success: true, data: updatedUser});
    },

    updatePassword: async (req, res) => {
        const {oldPassword, newPassword, user} = req.body
        console.log(req.body)
        const userInDb = await userDb.findById(user.id)
        if (!userInDb) {
            return res.send({message: "User not found", success: false, data: null});
        }
        const passValid = await bcrypt.compare(oldPassword, userInDb.password)

        if (passValid) {

            const salt = await bcrypt.genSalt(10)
            userInDb.password = await bcrypt.hash(newPassword, salt)
            await userInDb.save()

            return res.send({message: "Password changed success", success: true, data: null});
        } else {

            return res.send({message: "Old Passwords do not match", success: false, data: null});
        }

    },

  autoLogin: async (req, res) => {
        try {
            const { user } = req.body;
            if (!user) {
                return res.send({ message: "User data missing", success: false });
            }
            const userInDb = await userDb.findOne({ _id: user.id }, { projection: { password: 0 } });
            if (!userInDb) {
                return res.send({ message: "User not found", success: false, data: null });
            }
            const newUser = {
                id: userInDb._id,
                username: userInDb.username,
            };
            const token = jwt.sign(newUser, process.env.JWT_SECRET);
            res.send({ message: "User found successfully", success: true, token, data: userInDb });
        } catch (error) {
            console.error('Auto-login backend error:', error);
            res.status(500).send({ message: "Internal server error", success: false });
        }
    },
    allUsers: async (req,res) =>{
        const users = await userDb.find()
        return res.send({message: "Users fetched", success: true, data: users});
    },
    singleUser: async (req,res) => {
        const {username} = req.params
        const user = await userDb.findOne({ username }, { password: 0 });
        if (!user) {
            return res.send({ message: "User not found", success: false, data: null });
        }
        return res.send({message: "User fetched", success: true, data: user});
    }
    // addRecipe: async (req, res) => {
    //     const {name, images: recImages, ingredients, instructions, user} = req.body;
    //     const userInDB = await userDb.findOne({_id: user.id});
    //
    //     if (!userInDB) {
    //         return res.send({message: "user not found", success: false, data: null});
    //     }
    //
    //     const ingredientsArray = ingredients.split(',')
    //         .map(ingredient => ingredient.trim())
    //         .filter(ingredient => ingredient.length > 0);
    //
    //     const newRecipe = new recipesDb({
    //         name,
    //         images: recImages,
    //         ingredients: ingredientsArray,
    //         instructions,
    //         date: Date.now(),
    //         author: userInDB.username
    //     });
    //
    //     await newRecipe.save();
    //
    //     let newUser = await userDb.findOneAndUpdate(
    //         {_id: userInDB._id},
    //         {$push: {recipes: newRecipe._id}},
    //         {new: true, projection: {password: 0}}
    //     );
    //
    //     return res.send({message: "recipe added", success: true, data: newUser});
    // },
    // recipes: async (req, res) => {
    //     const recipes = await recipesDb.find()
    //     return res.send({message: "recipes fetched", success: true, data: recipes});
    // },
    // singleRecipe: async (req, res) => {
    //     const {id} = req.params
    //     console.log(id)
    //     const recipe = await recipesDb.findOne({_id: id})
    //     if (!recipe) {
    //         res.send({message: "recipe not found", success: false, data: null});
    //     } else {
    //         res.send({message: "recipe found", success: true, data: recipe});
    //     }
    //
    // },
    //
    // addRating: async (req, res) => {
    //     const {id, rating, user} = req.body
    //     console.log(req.body)
    //     const recipe = await recipesDb.findOneAndUpdate(
    //         {_id: id},
    //         {
    //             $push: {
    //                 ratings: {
    //                     rating,
    //                     ratedFrom: user.username
    //                 }
    //             }
    //         },
    //         {new: true}
    //     )
    //     res.send({message: "recipe rated", success: true, data: recipe});
    // },
    //
    // addComment: async (req, res) => {
    //     const {recipeId, comment, user} = req.body
    //     console.log(req.body)
    //     const userInDB = await userDb.findOne({_id: user.id})
    //
    //     if (!userInDB) {
    //         return res.send({message: "user not found", success: false, data: null});
    //     }
    //
    //     const recipe = await recipesDb.findOneAndUpdate(
    //         {_id: recipeId},
    //         {
    //             $push: {
    //                 comments: {
    //                     comment,
    //                     sender: userInDB.username,
    //                     timestamp:Date.now()
    //                 }
    //             }
    //         },
    //         {new: true}
    //     )
    //     res.send({message: "recipe rated", success: true, data: recipe});
    // },

}