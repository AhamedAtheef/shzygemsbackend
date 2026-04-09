import express from "express";
import Gem from "../models/Gem.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { getUsers, deleteUser } from "../controllers/adminController.js";

const router = express.Router();


// ✅ DASHBOARD STATS
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    // ✅ total users
    const totalUsers = await User.countDocuments();

    // ✅ total gems
    const totalGems = await Gem.countDocuments();

    // ✅ total likes (optimized)
    const likesResult = await Gem.aggregate([
      {
        $project: {
          likesCount: { $size: { $ifNull: ["$likes", []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" }
        }
      }
    ]);

    const totalLikes = likesResult[0]?.totalLikes || 0;

    // ✅ response
    res.status(200).json({
      success: true,
      totalUsers,
      totalGems,
      totalLikes
    });
  } catch (err) {
    console.error("STATS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats"
  
    });
  }
});

// =======================
// ✅ USERS MANAGEMENT
// =======================
router.get("/users", verifyToken, isAdmin, getUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

export default router;