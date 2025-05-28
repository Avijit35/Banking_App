import { error } from "console";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/bankImages/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("photo");

const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    } else if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      filePath: `bankImages/${req.file.filename}`,
    });
  });
};

export { uploadFile };
