const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema(
    {
        shortId:{
            type: String,
            required: true,
            unique: true
        },

        redirectURL: {
            type: String,
            required: true
        },
        userAgent: { type: String}, 
        deviceType: { type: String },  
        ip: { type: String},

        visitHistory:[{
            timestamp: { type:Number },
            userAgent: { type: String}, 
            deviceType: { type: String },  
            ip: { type: String},}],
        createdBy:{
            // assigning Foreign key
            type: mongoose.Schema.Types.ObjectId,
            ref: "usermodels",
        }
    }, 
    {timestamps: true}
);

const UrlModel = mongoose.model('urls', urlSchema);

module.exports = UrlModel;