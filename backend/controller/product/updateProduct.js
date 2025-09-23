const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')

async function updateProductController(req,res){
    try{

        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body

        // Basic XSS protection - remove HTML tags
        const sanitizeString = (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').trim();
        };

        // Sanitize input data
        const sanitizedData = {};
        for (const [key, value] of Object.entries(resBody)) {
            if (typeof value === 'string') {
                sanitizedData[key] = sanitizeString(value);
            } else {
                sanitizedData[key] = value;
            }
        }

        const updateProduct = await productModel.findByIdAndUpdate(_id, sanitizedData)
        
        res.json({
            message : "Product update successfully",
            data : updateProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = updateProductController