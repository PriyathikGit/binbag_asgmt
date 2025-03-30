import { User } from '../models/users.model.js';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/Cloudinary.js';
import { errorHandler, ErrorResponse } from '../utils/ErrorHandler.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  const { name, email, password, address, bio } = req.body;

  try {
    console.log(req.file);
    const localProfileImagePath = req.file?.path;

    if (!localProfileImagePath) {
      throw new ErrorResponse('please upload a profile picture', 400);
    }

    const profilePicture = await uploadOnCloudinary(localProfileImagePath);

    if (!profilePicture) {
      return next(new ErrorResponse('something went wrong', 500));
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      profilePicture: profilePicture?.url || '',
      bio: bio || '',
    });

    if (!user) {
      return errorHandler('no user created');
    }

    const createdUser = await User.findById(user._id).select('-password');

    if (!createdUser) {
      return next(
        new ErrorResponse('something went wrong with created user', 500)
      );
    }

    return res.status(200).json({
      success: true,
      message: 'succesful registration',
      createdUser,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

// Add this method to the User model
User.prototype.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Increased from '1d' to 7 days
  });
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:userId
// @access  Private (user can only access their own profile)
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:userId
// @access  Private (user can only update their own profile)
// const updateUser = async (req, res, next) => {
//   try {
//     // Filter out fields that shouldn't be updated
//     const fieldsToUpdate = {
//       name: req.body.name,
//       address: req.body.address,
//       bio: req.body.bio,
//       profilePicture: req.body.profilePicture,
//     };

//     const user = await User.findByIdAndUpdate(
//       req.params.userId,
//       fieldsToUpdate,
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select('-password');

//     if (!user) {
//       return next(
//         new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
//       );
//     }

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
      );
    }

    // Update basic fields
    user.name = req.body.name || user.name;
    user.address = req.body.address || user.address;
    user.bio = req.body.bio || user.bio;

    // Handle image upload if present
    if (req.file) {
      // Delete old image if exists
      if (user.profilePicture) {
        await deleteOnCloudinary(user.profilePicture);
      }
      const updateLocalImagePath = req.file?.path;
      if (!updateLocalImagePath) {
        return next(new ErrorResponse('cannot file local path', 400));
      }
      // Upload new image
      const result = await uploadOnCloudinary(updateLocalImagePath);

      user.profilePicture = result.url || '';
    }

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export { login, register, updateUser, getMe, getUser };
