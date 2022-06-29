const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validUrl = require("valid-url")

const createCollege = async (req,res)=>{
    try{
        let data = req.body

        const {name, fullName, logoLink} = data //destructuring required fields

        if(!name){
            return res.status(400).send({status : false, msg : "name is a required field"})
        } 

        const namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g  
        
        if(!name.match(namePattern)){
            return res.status(400).send({status : false, msg : "This is not a valid Name"})
        }

        if(!fullName){
            return res.status(400).send({status : false, msg : "fullName is a required field"})
        }

        const fullNamePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,150}$/gi  

        if(!fullName.match(fullNamePattern)){
            return res.status(400).send({status : false, msg : "This is not a valid full Name"})
        } 

        if(!logoLink){
            return res.status(400).send({status : false, msg : "logoLink is a required field"})
        } 

        const isValidUrl = function(url)
        {
            if (validUrl.isUri(url)) return true;
            return false
        }

        if(!isValidUrl){
        return res.status(400).send({status : false, msg : "This is not a valid logoLink"})
        } 

        if (!await collegeModel.exists({name : data.name})){ 
            let college = await collegeModel.create(data) 
            return res.status(201).send({status : true, msg : "Your college has been registered", data : college }) 
        }else{
            return res.status(400).send({status : false, msg : "this college name is already registered"})
        } 
    }
    catch (err){
        return res.status(500).send({status : false, err : err.message})
    }
}

const collegeDetails = async (req, res) => {
    try {
        let collegeName = req.query.name
        if (!collegeName || collegeName.trim().length == 0) {
            return res.status(400).send({ status: false, msg: "Collage Name is requierd" })
        }
        const findCollege = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ isDeleted: 0 })
        if(!findCollege){
            return res.status(404).send({ status: false, msg: "college not found" })
        }
        console.log("working")

        const internData = await internModel.find({ collegeId: findCollege._id, isDeleted: false})
        if(internData.length == 0){
            return res.status(404).send({ status: false, msg: "no interns found for the given link"})
        }

        console.log("working")
        return res.status(200).send({ data: findCollege })
    } catch (err) {
        return res.status(500).send({status: false, msg: err.message})
    }
}

module.exports = {createCollege, collegeDetails}
