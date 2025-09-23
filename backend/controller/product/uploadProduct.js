const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")
const { sanitizeObject } = require('../../helpers/sanitize')

async function UploadProductController(req,res){
    try{
        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Permission denied")
        }

        // Sanitize all input data before saving
        const sanitizedProductData = sanitizeObject(req.body)
    
        const uploadProduct = new productModel(sanitizedProductData)
        const saveProduct = await uploadProduct.save()

        res.status(201).json({
            message : "Product upload successfully",
            error : false,
            success : true,
            data : saveProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = UploadProductController