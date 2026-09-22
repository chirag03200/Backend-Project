import { asyncHandler } from  "../utils/asyncHandler.js"

const registerUser = asyncHandler( async (req, res) => {
    // steps for register students :-

    // get user detailed from frontend
    // validation - not empty, etc
    // check if user already exists: username, email
    // check for image, check for avatar
    // upload them to cloudinary, check avatar again
    // create user object - create entry in db
    // remove password and refresh token filed from response
    // check for user creation
    // return res
    
    const {fullName, email,username,password} = req.body
    console.log("email:", email);
    
})

export {
    registerUser,
}