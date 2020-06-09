This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`
    install all the project dependecies

### `npm run dev` or `npm start and npm run server`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

along with client app it will run server for upload files (server/index.js)

### `Basic flow`

    1.  Page will load file uploader, using the uploader you can select 1024*1024 file.
    2. once you select the file it will convert the image to 4 different dimensions and show the preview.
    3. Once you see the preview you can go head with upload by clicking upload button.
    4. once upload is successfull images will be send to server and server will save files to /public/images folder and you will see a successfull message.
    5. After uploading all the images page will redirect to /preview page wich will load all the uploaded images. (refreshing page wont work for know.)




