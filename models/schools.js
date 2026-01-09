const mongoose=require("mongoose");

const schoolSchema=new mongoose.Schema({
    SchoolName: String,
    ContactNo: String,
    Address: String,
    Locality: String,
    Affiliation: String,
    Primary: String,
    UpperPrimary: String,
    Secondary: String,
    HigherSecondary: String,
    Hostelfacility: String,
    Transport:String,
    Playground: String,
    DigitalEd: String
});

const Schools=new mongoose.model("Schools",schoolSchema);
module.exports=Schools;