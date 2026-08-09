import mongoose from "mongoose";

/*
--------------------------------------------------------------
User Schema
--------------------------------------------------------------

This schema defines the structure of a user stored in MongoDB.

Authentication will use:
- name
- email
- password

timestamps automatically adds:
- createdAt
- updatedAt
--------------------------------------------------------------
*/

const userSchema = new mongoose.Schema(
    {
        /*
        ----------------------------------------------------------
        User Name
        ----------------------------------------------------------
        */

        name: {
            type: String,
            required: true,
            trim: true,
        },

        /*
        ----------------------------------------------------------
        Email
        ----------------------------------------------------------
        */

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        /*
        ----------------------------------------------------------
        Password
        ----------------------------------------------------------

        We will NEVER store the user's plain-text password.

        The password will be hashed before being saved.
        ----------------------------------------------------------
        */

        password: {
            type: String,
            required: true,
        },
    },

    /*
    Automatically creates:
    createdAt
    updatedAt
    */

    {
        timestamps: true,
    }
);

/*
--------------------------------------------------------------
Create MongoDB Model
--------------------------------------------------------------
*/

const User = mongoose.model("User", userSchema);

/*
--------------------------------------------------------------
Export
--------------------------------------------------------------
*/

export default User;