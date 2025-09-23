const productModel = require("../../models/productModel")
const { sanitizeInput } = require('../../helpers/sanitize')

const filterProductController = async(req,res)=>{
 try{
        const categoryList = req?.body?.category || []

        // Sanitize category list
        const sanitizedCategoryList = categoryList.map(category => sanitizeInput(category))

        const products = await productModel.find({
            category :  {
                "$in" : sanitizedCategoryList
            }
        })

        res.json({
            data : products,
            message : "product",
            error : false,
            success : true
        })
 }catch(err){
    res.json({
        message : err.message || err,
        error : true,
        success : false
    })
 }
}

module.exports = filterProductController