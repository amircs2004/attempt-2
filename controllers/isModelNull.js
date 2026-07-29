const coonectedDatabase = require('../connection/connection');
const { User, Driver, Customer, Admin } = require('../models/typeOfUsers');

const checkModelsExport = async (req, res) => {
  try {
    // 1. Check if database connection works first
    await coonectedDatabase();

    // 2. Check if any imported model evaluates to undefined or null
    const modelStatus = {
      User: !!User,
      Driver: !!Driver,
      Customer: !!Customer,
      Admin: !!Admin,
    };

    const hasNullExports = Object.values(modelStatus).includes(false);

    if (hasNullExports) {
      return res.status(500).json({
        success: false,
        message: "One or more models evaluated to null or undefined",
        models: modelStatus,
      });
    }

    // 3. Optional: Run a safe lightweight query to ensure Mongoose discriminators are working
    const userCount = await User.countDocuments();

    return res.status(200).json({
      success: true,
      message: "All models exported successfully and database connection is active",
      models: modelStatus,
      totalUsersInDatabase: userCount,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking models or database",
      error: error.message,
    });
  }
};

module.exports = { checkModelsExport };