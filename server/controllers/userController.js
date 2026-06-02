import authModel from "../models/authModel.js";

//User Routes
const getUserInfo = async (req, res) => {
  const id = req.user.id;

  try {
    const userData = await authModel.findById(id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Info retrieved",
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error retriving data",
    });
  }
};

//Admin Routes
const getAllUsers = async (req, res) => {
  try {
    const data = await authModel.find({});
    return res.status(200).json({
      success: true,
      message: "All users retrieved",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await authModel.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.user?.id;

  // Prevent users from modifying their own role
  if (requesterId && id === requesterId && req.body.role) {
    return res.status(403).json({
      success: false,
      message: "You cannot modify your own role",
    });
  }

  try {
    const updated = await authModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating info",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await authModel.findByIdAndDelete(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting document",
    });
  }
};

export { getUserInfo, getAllUsers, getUser, updateUser, deleteUser };
