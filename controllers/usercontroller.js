const userModel = require('../Models/user.js');
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/email.js')
const otp_generator = require("otp-generator")
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res) => {
    try{
        const { fullName, email, gender, password, age } = req.body;

        const user = await userModel.findOne({email: email.toLowerCase()});
        if(user){
            return res.status(201).json({
            message:  `User with Email: ${email} already exists`
            })
        }
        const saltedRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltedRounds)

        const otp = otp_generator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        const data = {
            fullName,
            email: email.toLowerCase(),
            gender,
            password: hashedPassword,
            age,
            otp
        }

        const newUser = await userModel.create(data)

        const emailContent = {
            name: newUser.fullName,
            email: newUser.email,
            subject: 'Welcome to Zanbizar',
            htmlContent: `<html><head></head><body><p>Hello ${newUser.fullName},</p> We are thrilled to 
            have you onboard, please use the OTP below to verify your account. <br>$ {otp} </p></body></html>`
            
        }

        await sendEmail(emailContent)

        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        })
0-56
     } catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(201).json({
            message: ` All users found and the total is ${users.length}`,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: ` User found successfully `,
            data: user
        })
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id);

        if (!user) {
        return res.status(404).json({
            message: 'User not found'
           })
        }
        const data = {
          fullName,
          gender,
          email,
          password,
          age
        }
         
        // if (email) {
        // const emailExists = await userModel.findOne({ email: email.toLowerCase() })
        // if (emailExists) {
        //     return res.status(400).json({
        //         message: 'Email already in use'
        //     })
        // }
        // }

        if (email && email !== user.email) {
        const emailExists = await userModel.findOne({ email: email.toLowerCase() })
        if (emailExists) {
            return res.status(400).json({
                message: 'Email already in use'
            })
        }
        }
        
        const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser
        })

    } 
      catch (error) {
       res.status(500).json({
       message: error.message
       })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        console.log(isPasswordCorrect)
        if (isPasswordCorrect == false) {
            return res.status(400).json({
                message: 'Invalid Password'
            })
        }
        
        if (user.isVerified == false) {
            return res.status(400).json({
                message: 'User not verified, please check your email for the OTP sent to you.'
            })
        }
     
        const token = await jwt.sign({
            id: user._id,
            email:user.email
        }, process.env.JWT_SECRET, {expiresIn:'30 minutes'})

        res.status(200).json({
            message: 'Login successful',
            data: user,
            token:{}
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      });
    }
    await user.destroy();

    res.status(200).json({
      message: 'user deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'server error',
      data: error.message
    });
  }
}


exports.verifyEmail = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await userModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        if (user.otp !== otp) {
            return res.status(400).json({
               message: 'Invalid OTP'
             })
        }
       user.isVerified = true;
       user.status = "Active";
       user.otp = null

      // Save the Changes to the Database
        await user.save()

        res.status(200).json({
           message: 'Account verified successful',
           data: user
        })

    } catch (error) { 
        res.status(500).json({
            message: error.message
        })
    }
}