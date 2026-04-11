import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Transaction } from "../models/transaction.model.js";
const AccessAndRefreshTokens = async (userID) => {
  const user = await User.findById(userID);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
  return { accessToken, refreshToken };
};
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    throw new APIError(400, "Email, password and username are required");
  }
  const user_exists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (user_exists) {
    throw new APIError(400, "User with this email or username already exists");
  }
  const user = await User.create({
    email,
    password,
    username,
    balance: 0,
  });
  if (!user) {
    throw new APIError(
      500,
      "Failed to create user due to some internal error, try again",
    );
  }
  return res
    .status(201)
    .json(new APIresponse(201, "User registered successfully", user));
});
const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!(email || username) || !password) {
    throw new APIError(400, "Email/username and password are required");
  }
  const user_exists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user_exists) {
    throw new APIError(404, "User with this email or username does not exist");
  }
  const PasswordMatch = await user_exists.checkPassword(password);
  if (!PasswordMatch) {
    throw new APIError(401, "Invalid password");
  }
  const { accessToken, refreshToken } = await AccessAndRefreshTokens(
    user_exists._id,
  );
  return res.status(200).json(
    new APIresponse(200, "user logged in successfully", {
      accessToken,
      refreshToken,
    }),
  );
});
const transaction = asyncHandler(async (req, res) => {
  const { type, amount, category, note, date } = req.body;
  const user = await User.findById(req.user._id);
  let curr_balance = user.balance;
  const transaction_amount = Number(amount);
  if (!type || !amount) {
    throw new APIError(400, "Type and amount are required");
  }
  if (type === "income") {
    curr_balance = curr_balance + transaction_amount;
  } else if (type === "expense") {
    if (curr_balance < transaction_amount)
      throw new APIError(
        411,
        "you dont have enough balance for this transaction!",
      );
    else curr_balance = curr_balance - transaction_amount;
  }
  const transaction = await Transaction.create({
    type,
    amount: transaction_amount,
    category,
    note,
    date: date || Date.now(),
    user: req.user._id,
  });
  user.balance = curr_balance;
  await user.save({ validateBeforeSave: false });
  if (!transaction) {
    throw new APIError(
      500,
      "Failed to create transaction due to some internal error, try again",
    );
  }
  return res
    .status(202)
    .json(
      new APIresponse(202, "Transaction created successfully", transaction),
    );
});

const Report = asyncHandler(async (req, res) => {
  // 1. Extract from req.query
  const { month, year } = req.query;

  // 2. Validate existence
  if (!month || !year) {
    throw new APIError(400, "Month and year are required query parameters");
  }

  // 3. Convert to Numbers (Query params always arrive as strings)
  const selectedMonth = parseInt(month); // 3
  const selectedYear = parseInt(year); // 2026
  const start_date = new Date(selectedYear, selectedMonth - 1, 1);
  const end_date = new Date(selectedYear, selectedMonth, 0);
  const expense_report = await Transaction.find({
    user: req.user._id,
    date: {
      $gte: start_date, //greater than or equal to
      $lte: end_date, //less than or equal to
    },

    type: "expense",
  });

  let total_expense = 0;
  for (let i = 0; i < expense_report.length; i++) {
    total_expense +=  expense_report[i].amount;
  }
  const income_report = await Transaction.find({
    user: req.user._id,
    date: {
      $gte: start_date, //greater than or equal to
      $lte: end_date, //less than or equal to
    },

    type: "income",
  });

  let total_income = 0;
  for (let i = 0; i < income_report.length; i++) {
    total_income += income_report[i].amount;
  }
  const total_savings = total_income - total_expense;
  return res.status(200).json(
    new APIresponse(200, "Report generated successfully", {
      total_income,
      total_expense,
      total_savings,
    }),
  );
});
export { registerUser, login, transaction, Report };
