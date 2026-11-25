const cloudinary = require('../config/cloudinary');
const postModel = require('../Models/post');
const userModel = require('../Models/user');
const fs = require ('fs');


exports.createPost = async (req, res) => {
    try {
        const { userId } = req.params;
        const { content } = req.body;
        const files = req.files;
        const media = [];
    // check for allowed files here
        if (files.length > 0) {

            const invalidFiles = files.map((file) => {
               return file.mimetype.startsWith('application/pdf')
            })

            if (invalidFiles.includes(true)) {
                files.forEach(element => {
                    if (fs.existsSync(element.path)) {
                        fs.unlinkSync(element.path)
                    }
                });
                return res.status(400).json({
                 message: 'PDF is not allowed'
                })
                
            }

        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: 'User trying to create a post does not exist '
            })
        }

        // upload files to cloudinary and push to media variable
        for (const file of files){   //loops through
            const result = await cloudinary.uploader.upload(file.path, (error, data) => {
                if(error) {
                   fs.unlinkSync
                   return res.status(500).json({
                        message: "Failed to Upload File: " + error.message
                    })
                } else{
                    return data
                }
            })

            const mediaObject = {
                imageUrl: result.secure_url,
                imageId: result.public_id
            }
            media.push(mediaObject);
            fs.unlinkSync// unlinks the file from uploads
        }

        // creates the data object for the data to create
        const data = {
            content,
            userId,
            media
        }

        // const newPost = await  postmodel.create(data);
        const newPost = new postModel(data);

        user.posts.push(newPost._id);
        await newPost.save();
        await user.save();

        res.status(201).json({
            message: 'Post created successfully',
            data: newPost
        })
    } catch (error) {
        res.status(500).json({
            message: error.message 
        })
    }
}


exports.getOnePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await postModel.findById(id);

        if(!post){
            return res.status(404).json({
                message: "post not found"
            })
        }
        res.status(200).json({
            message: ` post found successfully `,
            data: post
        })
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}