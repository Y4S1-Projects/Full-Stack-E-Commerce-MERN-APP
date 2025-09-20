# Full-Stack-E-Commerce-MERN-APP
Full Stack E-Commerce MERN APP

![Alt text](Full%20Stack%20E-Commerce%20MERN%20App.png?raw=true "Title")

Backend .env file 

MONGODB_URI = 
TOKEN_SECRET_KEY = 
FRONTEND_URL

Frontend .env file

REACT_APP_CLOUD_NAME_CLOUDINARY = 

Image : https://drive.google.com/drive/folders/1KmY74OYniEodtOVAjNGJv4628HghRbcQ?usp=sharing

Full Video available on youtube : Dynamic Coding with Amit

### Cloudinary upload preset (client-side uploads)

The frontend uploads images directly to Cloudinary using an unsigned upload preset. By default the app uses the preset name `mern_product` (configured in `frontend/.env` as `REACT_APP_CLOUDINARY_UPLOAD_PRESET`). If you see the error "Upload preset not found" you need to create or configure this preset in your Cloudinary dashboard.

Steps to create an unsigned upload preset:

1. Log in to your Cloudinary dashboard.
2. Go to Settings -> Upload.
3. Scroll to the "Upload presets" section and click "Add upload preset".
4. Give it the name `mern_product` (or another name and put that name in `frontend/.env`).
5. Set "Signing mode" to "Unsigned".
6. Save the preset.

After creating the preset restart your React dev server so env changes take effect.

