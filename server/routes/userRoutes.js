import express from "express";
import {
  bookVisit,
  createUser,
  allBookings,
  cancelBooking,
  toFav,
  getAllFavorites,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit);
router.post("/allBookings", allBookings);
router.post("/removeBooking/:id", cancelBooking);
router.post("/toFav/:rid", toFav);
router.post("/allFavs", getAllFavorites);
export { router as userRoute };
