import { asyncHandler } from  "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

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

    if (
        [fullName, email, username, password].some((field) => 
        field?.trim() === "" )
    )   {
        throw new ApiError("All fields are required", 400)
    }

    const existedUser = User.findOne({
        $or : [{ usernaem }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, 'User with email or username  already exists')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError("Avatar file is required", 400)
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError("Avatar file is required", 400)
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", 
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

} )

export {
    registerUser,
}