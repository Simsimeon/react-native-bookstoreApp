import express from "express"
import cloudinary from "../lib/cloudinary.js"
import Book from "../../models/Book.js"
import protectedRoutes from "../middleware/auth.middleware.js"
const router = express.Router()
router.post("/", protectedRoutes, async (req, res) => {
    try {
        const { title, cation, rating, image } = req.body
        if (!image || !title || !cation || !rating) return res.status(400).json({ message: "Please provide an image" })
        //    upload the image to cloudinary
        const upLoadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = upLoadResponse.secure_url
        // save to the database
        const newBook = new Book({
            title,
            cation,
            rating,
            image: imageUrl,
            user: req.user._id,
        })
        await newBook.save()
        res.status(201).json(newBook)
    } catch (err) {
        console.log('Error creating book', err)
        res.status(500).json({ message: err.message })
    }
    // res.send("Book routes")
})
router.get("/", protectedRoutes, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const books = await Book.find()
            .sort({ created: -1 })  //descending order
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage")

        const totalBooks = await Book.countDocuments()

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        })


    } catch (err) {
        console.log("Error in get all books", err);
        res.status(500).json({
            message: "Internal server error"
        })

    }
})
router.get("/user", protectedRoutes, async (req, res) => {
    // get recommended books by the logged in user
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(books)




    } catch (err) {
        console.error("Get user error", err.message);
        res.status(500).json({ message: "Server error" })

    }

})


router.delete("/:id", protectedRoutes, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) return res.status(404).json({ message: "Book not found" })
        // check if the user is the creator of the book
        if (book.user.toString() !== req.user._id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        // delete image from cloudinary as well
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId)
            } catch (err) {
                console.log("Error deleting image from cloudinary", err)
            }
        }
        await book.deleteOne();
        res.json({ message: "Book deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })

    }
})

export default router  