/*import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import multer from 'multer';

//,{ErrorHandler}
const upload = multer({ dest: './public/files' });

/*const onError: ErrorHandler<NextApiRequest, NextApiResponse> = (error, req, res) => {
  res.status(500).json({ error: `Server error: ${error.message}` });
};*/

/*const apiRoute = nc<NextApiRequest, NextApiResponse>({ onError });


apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  // req.file contains information about the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});

export default apiRoute;
*/