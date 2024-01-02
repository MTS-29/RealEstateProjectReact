import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";

export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");

  let { email } = req.body;

  //   console.log(email);

  //Finding the email from the unique field to compare with the current email
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  if (!userExist) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

//To book a visit to residency
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVists: true },
    });

    if (alreadyBooked.bookedVists.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is alreay booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVists: { push: { id, date } },
        },
      });
      res.send("Your visit is booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});
// To get all bookings
export const allBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVists: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

//Function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVists: true },
    });

    const index = user.bookedVists.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVists.splice(index, 1);
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVists: user.bookedVists,
        },
      });
      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to add fav residency for a user
export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id != rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//funtion to get all favs residencies
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const allFavs = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send({ allFavs });
  } catch (err) {
    throw new Error(err.message);
  }
});
