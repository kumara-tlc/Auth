##mongoDB atlas setup
Open the MongoDB Atlas website
Click on the start free to create an account in mongo dB atlas  
Create an account 
Open mail and verify the MangoDB Atlas
Sign in using email and password.
Click remind me later
Click the Create button and click the free option then click the Create button
Create a user and click finish & close the button 
Click overview then click the connect button 
Click the drivers option
That drivers page in the third point copies that URL
Open the Visual Studio application then open the Auth file
Create a new file in the Auth file  in the outside package
The new file name is .env
Inside the .env file create a Const variable for store the copied URL (ex: DATABASE_CONNECTION_STRING = <paste the Atlas ULR>) 
Paste the URL and remove the password and enter your user password.
       Example: DATABASE_CONNECTION_STRING = "mongodb+srv://xxxxxx:xxxx%40xx@cluster0.q3xw2fq.mongodb.net/?retryWrites=true&w=majority".
Use the URL Encode Web side to encode your symbols = https://www.urlencoder.org  
       Password:     xxxx@xx - xxxx%40xx
                     xxxxxx - xxxxxx
