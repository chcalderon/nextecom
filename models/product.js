import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import Category from "@/models/category";
import Tag from "@/models/tag";
import User from "@/models/user";

const ratingSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            maxlength: 200,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true } // Add timestamps
);

// const likeSchema = new mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//         },
//     },
//     { timestamps: true } // Add timestamps
// );

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            maxlength: 160,
            text: true, // for text search
        },
        slug: {
            type: String,
            lowercase: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 2000,
            text: true,
        },
        price: {
            type: Number,
            required: true,
            trim: true,
            maxlength: 32,
            validate: {
                validator: function (value) {
                    return value !== 0;
                },
                message: "Price must be greater than 0.",
            },
        },
        previousPrice: Number,
        color: String,
        brand: String,
        stock: Number,
        shipping: {
            type: Boolean,
            default: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
            },
        ],
        images: [
            {
                public_id: {
                    type: String,
                    default: "",
                },
                secure_url: {
                    type: String,
                    default: "",
                },
            },
        ],
        sold: {
            type: Number,
            default: 0,
        },
        // likes: [likeSchema],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        ratings: [ratingSchema],
        // ratings: [
        //   {
        //     rating: {
        //       type: Number,
        //       min: 1,
        //       max: 5,
        //     },
        //     comment: {
        //       type: String,
        //       maxlength: 200,
        //     },
        //     postedBy: {
        //       type: mongoose.Schema.Types.ObjectId,
        //       ref: "User",
        //     },
        //   },
        // ],
    },
    { timestamps: true }
);

productSchema.plugin(uniqueValidator);

export default mongoose.models.Product ||
    mongoose.model("Product", productSchema);
