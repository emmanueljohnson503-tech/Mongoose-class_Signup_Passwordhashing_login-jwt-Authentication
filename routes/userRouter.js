const router = require('express').Router();

const { signUp, getOneUser, getAllUsers , updateUser, deleteUser, login, verifyEmail, forgotPassword, resetPassword } = require('../controllers/usercontroller');

router.post('/signup', signUp);
router.post('/login', login);
router.get('/getAll', getAllUsers);
router.get('/getOne/:Id', getOneUser);
router.patch('/updateUser/:Id', updateUser);
router.delete('/deleteUser/:Id', deleteUser);
router.post('/verify-otp', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword)

module.exports = router;