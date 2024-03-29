# Running the API Locally

## Rest API Programs to Test with

In order to test our code locally, we have a few options. We can use in-built web-request commands that are featured within your Operating System's terminal or we can use a REST API Caller program like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/). You can access them and download one by hitting the respective links.

To run your API locally, we must now get our terminal to be in the same folder as our root folder for our API. If you opened your terminal via VS Code, you can skip this next step and get straight to running some commands!

## Testing your Code Locally

Now that we are in the right folder, we can now test the code. We can test the code by running `oneblink api serve`. After running this, you should get a confirmation similar to this:

![An image of a OneBlink hosted API running locally](../pics/APIHostingLocalAPI.png)

Now, using Postman in this example, we can test this endpoint. In Postman, I set the type of method to `GET` and I write in the url of `localhost:3000/helloworld`. Now upon hitting submit:

![A picture showing the API running locally and returning the data successfully in Postman](../pics/APILocalPostman.png)

Success! We can see our code has worked perfectly, it has returned our list we are going to use! Now, we can deploy it!
