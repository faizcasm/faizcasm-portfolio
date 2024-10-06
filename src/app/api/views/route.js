import fs from 'fs';
import path from 'path';

// Define the path to the views file
const viewsFilePath = path.join(process.cwd(), 'views.txt');

// Handler for fetching and updating views
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Check if the views.txt file exists, if not, initialize it with '0'
    if (!fs.existsSync(viewsFilePath)) {
      fs.writeFileSync(viewsFilePath, '0');
    }

    // Read the current view count from the file
    const views = fs.readFileSync(viewsFilePath, 'utf8');
    
    // Return the view count as JSON
    res.status(200).json({ views: parseInt(views, 10) });
  } else if (req.method === 'POST') {
    let views = 0;

    // Check if the file exists and read the views count
    if (fs.existsSync(viewsFilePath)) {
      views = parseInt(fs.readFileSync(viewsFilePath, 'utf8'), 10);
    }

    // Increment the views count
    views += 1;

    // Write the updated views back to the file
    fs.writeFileSync(viewsFilePath, views.toString());

    // Return the updated views count
    res.status(200).json({ views });
  } else {
    // Return 405 if the request method is not GET or POST
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
