// ===== Dependencies =====
const mongoose = require("mongoose");
const File = require("../models/File");
const User = require("../models/User");

// ===== Share File =====
const shareFile = async (req, res) => {
  try {
    // ===== File ID Validation =====
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    // ===== Sharing Input Validation =====
    const { email, permission } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Enter the user's email address",
      });
    }

    if (!["view", "edit"].includes(permission)) {
      return res.status(400).json({
        message: "Permission must be view or edit",
      });
    }

    // ===== File Ownership Check =====
    const file = await File.findOne({
      _id: id,
      owner: req.user._id,
    }).select("_id");

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // ===== Find Sharing Recipient =====
    const recipient = await User.findOne({
      email: email.trim().toLowerCase(),
      isActive: true,
    }).select("_id name email");

    if (!recipient) {
      return res.status(404).json({
        message: "No active user was found with this email",
      });
    }

    // ===== Prevent Sharing With Owner =====
    if (recipient._id.equals(req.user._id)) {
      return res.status(400).json({
        message: "You already own this file",
      });
    }

    // ===== Save Sharing Permission =====
    // Replace the recipient's existing entry without creating duplicates.
    const updatedFile = await File.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id,
      },
      [
        {
          $set: {
            sharedWith: {
              $concatArrays: [
                {
                  $filter: {
                    input: { $ifNull: ["$sharedWith", []] },
                    as: "share",
                    cond: {
                      $ne: ["$$share.user", recipient._id],
                    },
                  },
                },
                [
                  {
                    user: recipient._id,
                    permission,
                    sharedAt: new Date(),
                  },
                ],
              ],
            },
          },
        },
      ],
      {
        updatePipeline: true,
        returnDocument: "after",
      }
    ).select("_id");

    if (!updatedFile) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // ===== Sharing Response =====
    return res.status(200).json({
      message: "File sharing saved successfully",
      share: {
        user: {
          id: recipient._id,
          name: recipient.name,
          email: recipient.email,
        },
        permission,
      },
    });
  } catch (error) {
    console.error("File sharing failed:", error.message);

    return res.status(500).json({
      message: "Unable to share file",
    });
  }
};

// ===== Get File Sharing =====
const getFileShares = async (req, res) => {
  try {
    const { id } = req.params;

    // ===== File ID Validation =====
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    // ===== File Ownership Check =====
    const file = await File.findOne({
      _id: id,
      owner: req.user._id,
    })
      .select("sharedWith")
      .populate("sharedWith.user", "name email isActive");

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // ===== Sharing List =====
    const shares = file.sharedWith
      .filter((share) => share.user)
      .map((share) => ({
        user: {
          id: share.user._id,
          name: share.user.name,
          email: share.user.email,
          isActive: share.user.isActive,
        },
        permission: share.permission,
        sharedAt: share.sharedAt,
      }));

    return res.status(200).json({
      shares,
    });
  } catch (error) {
    console.error("Loading file sharing failed:", error.message);

    return res.status(500).json({
      message: "Unable to load file sharing",
    });
  }
};

// ===== Remove File Sharing =====
const removeFileShare = async (req, res) => {
  try {
    const { id, userId } = req.params;

    // ===== ID Validation =====
    if (
      !mongoose.isObjectIdOrHexString(id) ||
      !mongoose.isObjectIdOrHexString(userId)
    ) {
      return res.status(400).json({
        message: "Invalid file or user ID",
      });
    }

    // ===== Remove Sharing Entry =====
    const result = await File.updateOne(
      {
        _id: id,
        owner: req.user._id,
      },
      {
        $pull: {
          sharedWith: {
            user: userId,
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.status(200).json({
      message: "File sharing removed successfully",
    });
  } catch (error) {
    console.error("Removing file sharing failed:", error.message);

    return res.status(500).json({
      message: "Unable to remove file sharing",
    });
  }
};

// ===== Shared With Me =====
const getSharedFiles = async (req, res) => {
  try {
    // ===== Find Files Shared With Current User =====
    const sharedFiles = await File.find({
      owner: { $ne: req.user._id },
      "sharedWith.user": req.user._id,
    })
      .select(
        "originalName mimeType size folder owner category sharedWith createdAt updatedAt"
      )
      .populate("folder", "name")
      .populate("owner", "name email isActive")
      .sort({ createdAt: -1 });

    // ===== Prepare Shared Files List =====
    const files = sharedFiles
      .filter((file) => file.owner && file.owner.isActive)
      .map((file) => {
        const share = file.sharedWith.find((entry) => {
          return entry.user.equals(req.user._id);
        });

        return {
          _id: file._id,
          originalName: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          folder: file.folder,
          category: file.category,
          owner: {
            _id: file.owner._id,
            name: file.owner.name,
            email: file.owner.email,
          },
          permission: share.permission,
          sharedAt: share.sharedAt,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        };
      });

    return res.status(200).json({
      files,
    });
  } catch (error) {
    console.error("Loading shared files failed:", error.message);

    return res.status(500).json({
      message: "Unable to load shared files",
    });
  }
};

// ===== Controller Exports =====
module.exports = {
  shareFile,
  getFileShares,
  removeFileShare,
  getSharedFiles,
};