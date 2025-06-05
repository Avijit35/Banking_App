import { createNewRecord, findAllRecord } from "../services/db.service.js";

const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const dbRes = await createNewRecord(data, schema);
    res.status(200).json({
      messge: "Data Inserted Successfully",
      sucess: true,
      data: dbRes,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(422).json({
        messge: "Entity duplication error",
        sucess: false,
        error,
      });
    } else {
      res.status(500).json({
        messge: "Internal Server Error",
        sucess: false,
        error,
      });
    }
  }
};

const fetchData = async (req, res, schema) => {
  try {
    const data = await findAllRecord(schema);

    return res.status(200).json({
      messge: "Record found !",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      messge: "Internal server error",
      error,
    });
  }
};

export { createData, fetchData };
