import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get('/filteredimage', async (req: Request, res: Response) => {
    const image_url: string = req.query.image_url;

    if (image_url) {
      try {
        const filteredPath: string = await filterImageFromURL(image_url);
         res.status(200).sendFile(filteredPath, () => {
          deleteLocalFiles([filteredPath]);
         })
      } catch (error) {
        return res.status(422).send('Unable to process image');
      }
    } else {
      res.status(400).send('Image url is needed');
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();