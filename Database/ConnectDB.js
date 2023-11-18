import mongoose from "mongoose";

export const ConnectDB = () => {

    mongoose.connect(process.env.MONGO_URL, {
        dbName: "PaaiEsports"
    })
        .then(() => {
            console.log("Connected to DB");
        }).catch((e) => {
            console.log("Some Error");
        })
}