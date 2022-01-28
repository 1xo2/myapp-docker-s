const express = require('express');
const expressAsyncHandler = require('express-async-handler');
// const bcrypt = require('bcryptjs');
const userModal = require('../DBModels/userModal');
const { isAdmin } = require('../utils-server.js.js');
//const { utils } = require('../../src/utils.js')

const userRouter = express.Router();




console.log('Enter: Router:: User')


userRouter.get('/',isAdmin, expressAsyncHandler(async (req, res) => {
    try {

        const userList = await userModal.find({})
        res.send(userList);

    } catch (error) {

        res.send({ userRouteMSG: error.message })
        console.log('userRouteMSG:error.message:', error)
    }

}));
userRouter.post('/', isAdmin, expressAsyncHandler(async (req, res) => {
    try {

        console.log('req.body._id:no', !req.body.isAdmin)
        console.log('req.body._id:', req.body.isAdmin)

        if (!req.body._id
            || req.body.isAdmin === undefined
            || !req.body.isSeller === undefined
            || !req.body.name
        ) {
            return res.status(400).send({
                msg: " Error: bad request: object must required filed",
            });
        }


        const user = await userModal.findById(req.body._id)

        if (user.name !== req.body.name) {
            return res.status(400).send({
                msg: " Error: bad request: no 8d8d8sj",
            });
        }


        const userNew = await user.updateOne({
            isSeller: req.body.isSeller,            
            isAdmin: req.body.isAdmin,
        })


        res.send(userNew);

    } catch (error) {

        res.send({ userRouteMSG: error.message })
        console.log('userRouteMSG:error.message:', error)
    }

}));




// // isGoogleToken_Auth,
// userRouter.post(USERS.LOGIN, isGoogleToken_Auth, expressAsyncHandler(async (req, res) => {

//     try {

//         //console.log('req.body.email:', req.body.email)
//         const signInUser = await userModal.findOne({ email: req.body.email })

//         if (signInUser) {

//             if (bcrypt.compareSync(
//                 req.body.p_id + process.env.JWT_PASSWORD_SECRET,
//                 signInUser.password
//             )) {

//                 res.send({
//                     _id: signInUser._id,
//                     name: signInUser.name,
//                     email: signInUser.email,
//                     isAdmin: signInUser.isAdmin,
//                     isSeller: signInUser.isSeller,
//                     token: getToken(signInUser)
//                 }); return;
//             }
//             else {
//                 throw new Error('email not math to provider id.')
//             }
//         }
//         else {
//             // new user Registration

//             const registerUser = new userModal({
//                 email: req.body.email,
//                 name: req.body.name,
//                 password: getPassword(req.body.p_id),
//             })

//             const newRegUser = await registerUser.save();

//             if (newRegUser) {
//                 res.send({
//                     _id: newRegUser._id,
//                     name: newRegUser.name,
//                     email: newRegUser.email,
//                     isAdmin: newRegUser.isAdmin,
//                     isSeller: registerUser.isSeller,
//                     token: getToken(newRegUser)
//                 });
//             }
//             else {
//                 res.status(401).send({ msg: 'Invalid user Data.' });
//             }
//         }

//     } catch (error) {
//         console.log('error.message:', error.message)
//         res.status(401).send({ error: error.message, msg: 'Invalid eMail or providerID.' });
//     }
// })
// );


// userRouter.get("/createadmin", expressAsyncHandler(async (req, res) => {
//     // localhost:5000/api/users/createadmin

//     console.log('createadmin:')

//     try {
//         const user = new userModal({
//             name: 'yaniv ad',
//             email: 'ad@a.com',
//             // password: bcrypt.hashSync('ad', 8),
//             isAdmin: true
//         });
//         //console.log('\r\n\ user', user)

//         const newUser = await user.save();
//         res.send(newUser);

//         //console.log('\r\n\ newUser:', newUser)


//     } catch (error) {

//         res.send({ userRouteMSG: error.message })
//         console.log('userRouteMSG:error.message:', error)
//     }

// }));

// userRouter.get("/:id", expressAsyncHandler(async (req, res) => {


//     const user = await userModal.findById(req.params.id)
//     console.log('\r\n ---user:', user)
//     if (user) {
//         res.send(user);
//     } else {
//         res.status(404).send({ msg: 'User Not Found' });
//     }

// }))



// const getPassword = (provider_id) => {

//     return bcrypt.hashSync(provider_id + process.env.JWT_PASSWORD_SECRET, 8);
// }


module.exports = userRouter;



// userRouter.put("/profile", isAuth, expressAsyncHandler(async (req, res) => {

//     // const user = await userModal.findById(req.body.userId)

//     // if (user) {

//     //     user.name = req.body.name || user.name
//     //     user.email = req.body.email || user.email
//     //     if (req.body.password) {
//     //         user.password = getPassword()
//     //     }
//     //     const updateProfile = await user.save();

//     //     res.send({
//     //         _id: updateProfile._id,
//     //         name: updateProfile.name,
//     //         email: updateProfile.email,
//     //         isAdmin: updateProfile.isAdmin,
//     //         token: getToken(updateProfile)
//     //     })

//     //     //res.save(updateProfile);
//     // } else {
//     //     res.status(404).send({ msg: 'User Not Found' });
//     // }

// }))

// userRouter.post("/register", expressAsyncHandler(async (req, res) => {

//     //console.log('userRouter.get("/register":', req)

//     const registerUser = new userModal({
//         email: req.body.email,
//         p_id: req.body.p_id,
//         // password: getPassword(req.body.p_id, req.body.email),
//         name: req.body.name
//     })

//     const newRegUser = await registerUser.save();

//     if (newRegUser) {
//         res.send({
//             _id: newRegUser._id,
//             name: newRegUser.name,
//             email: newRegUser.email,
//             isAdmin: newRegUser.isAdmin,
//             isSeller: registerUser.isSeller,
//             token: getToken(newRegUser)
//         });
//     }
//     else {
//         res.status(401).send({ msg: 'Invalid user Data.' });
//     }

// }));
