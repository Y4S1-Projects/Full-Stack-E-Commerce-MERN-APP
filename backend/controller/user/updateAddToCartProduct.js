const addToCartModel = require("../../models/cartProduct")

const updateAddToCartProduct = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const addToCartProductId = req?.body?._id

        const qty = req.body.quantity

        // Validate quantity is a positive number
        if (qty !== undefined && (isNaN(qty) || qty < 1 || qty > 100)) {
            return res.status(400).json({
                message: "Invalid quantity. Must be between 1 and 100",
                error: true,
                success: false
            })
        }

        const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId},{
            ...(qty && {quantity : qty})
        })

        res.json({
            message : "Product Updated",
            data : updateProduct,
            error : false,
            success : true
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = updateAddToCartProduct