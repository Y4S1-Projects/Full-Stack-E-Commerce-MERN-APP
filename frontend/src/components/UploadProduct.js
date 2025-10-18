import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { CgClose } from 'react-icons/cg';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UploadProduct = ({ onClose = () => {}, fetchData = () => {} }) => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    description: '',
    price: '',
    sellingPrice: '',
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState('');

  // Strict XSS protection: allow only text, no HTML
  const sanitizeInput = (input) => DOMPurify.sanitize(String(input ?? ''), { ALLOWED_TAGS: [] });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === 'price' || name === 'sellingPrice'
        ? sanitizeInput(value).replace(/[^\d.]/g, '') // keep numeric input clean
        : sanitizeInput(value);

    setData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await uploadImage(file);
      if (uploaded?.url) {
        setData((prev) => ({ ...prev, productImage: [...prev.productImage, uploaded.url] }));
      } else {
        toast.error('Image upload failed');
      }
    } catch (err) {
      toast.error('Image upload error');
    }
  };

  const handleDeleteProductImage = (index) => {
    if (index < 0 || index >= data.productImage.length) return;
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: newProductImage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.uploadProduct.url, {
        method: SummaryApi.uploadProduct.method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...data,
          // ensure numbers are numbers server-side
          price: Number(data.price || 0),
          sellingPrice: Number(data.sellingPrice || 0),
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData?.success) {
        toast.success(responseData?.message || 'Product uploaded');
        onClose();
        fetchData();
      } else {
        toast.error(responseData?.message || 'Upload failed');
      }
    } catch {
      toast.error('Network error while uploading');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-slate-200 bg-opacity-35">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-lg font-bold">Upload Product</h2>
          <button
            type="button"
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <CgClose />
          </button>
        </div>

        <form className="grid h-full gap-2 p-4 overflow-y-scroll pb-5" onSubmit={handleSubmit}>
          <label htmlFor="productName">Product Name :</label>
          <input
            type="text"
            id="productName"
            placeholder="enter product name"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-3">
            Brand Name :
          </label>
          <input
            type="text"
            id="brandName"
            placeholder="enter brand name"
            value={data.brandName}
            name="brandName"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category" className="mt-3">
            Category :
          </label>
          <select
            required
            value={data.category}
            name="category"
            id="category"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value="">Select Category</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={`${el.value}-${index}`}>
                {el.label}
              </option>
            ))}
          </select>

          <label htmlFor="uploadImageInput" className="mt-3">
            Product Image :
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Image</p>
                <input type="file" id="uploadImageInput" className="hidden" onChange={handleUploadProduct} />
              </div>
            </div>
          </label>

          <div>
            {data?.productImage?.[0] ? (
              <div className="flex items-center gap-2">
                {data.productImage.map((img, index) => (
                  <div className="relative group" key={`${img}-${index}`}>
                    <img
                      src={img}
                      alt={sanitizeInput(`Product ${index + 1}`)}
                      width={80}
                      height={80}
                      className="bg-slate-100 border cursor-pointer"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(img);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 hidden p-1 text-white bg-red-600 rounded-full cursor-pointer group-hover:block"
                      onClick={() => handleDeleteProductImage(index)}
                      aria-label="Delete image"
                      title="Delete image"
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-600">*Please upload product image</p>
            )}
          </div>

          <label htmlFor="price" className="mt-3">
            Price :
          </label>
          <input
            type="number"
            id="price"
            placeholder="enter price"
            value={data.price}
            name="price"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="sellingPrice" className="mt-3">
            Selling Price :
          </label>
          <input
            type="number"
            id="sellingPrice"
            placeholder="enter selling price"
            value={data.sellingPrice}
            name="sellingPrice"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description" className="mt-3">
            Description :
          </label>
          <textarea
            id="description"
            className="h-28 p-1 bg-slate-100 border resize-none"
            placeholder="enter product description"
            rows={3}
            onChange={handleOnChange}
            name="description"
            value={data.description}
          />

          <button type="submit" className="px-3 py-2 mb-10 text-white bg-red-600 hover:bg-red-700">
            Upload Product
          </button>
        </form>
      </div>

      {/* Fullscreen image modal */}
      {openFullScreenImage && <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />}
    </div>
  );
};

export default UploadProduct;
