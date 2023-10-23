import fs from 'fs'
import express, { Application, Request, Response } from 'express'
import multer from 'multer'
import sharp from 'sharp'

const app: Application = express()
const storage = multer.memoryStorage();
const upload = multer({ storage });

const port: number = 3001

// =============== Middleware ===============
app.use(express.static("./uploads"));

// =============== Routes ===============



interface File {
    buffer: Buffer;
    originalname: string;
} 


/**
 * Extracts the buffer and original name from the uploaded file in the request object.
 * 
 * @param req - The request object containing the uploaded file.
 * @returns An object containing the buffer and original name of the uploaded file.
 */
app.post("/", upload.single("picture"), async (req: Request , res: Response) => {
    fs.access("./uploads", (error) => {
      if (error) {
        fs.mkdirSync("./uploads");
      }
    });
    const { buffer, originalname } = req.file! as File;
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.webp`;
    await sharp(buffer).webp({ quality: 20 }) .toFile("./uploads/" + ref);
    const link = `http://localhost:${port}/${ref}`;
    return res.json({ link });
});

app.listen(port, function () {
    console.log(`App is listening on port ${port}`)
})