##mongoDB atlas setup

Open the MongoDB Atlas website
<img width="1484" alt="MicrosoftTeams-image" src="https://github.com/kumara-tlc/Auth/assets/139904424/0fb067de-08ec-4dd6-a6bd-9d9a73a3d313">

Click on the start free to create an account in mongo dB atlas  
<img width="1103" alt="MicrosoftTeams-image (8)" src="https://github.com/kumara-tlc/Auth/assets/139904424/fc2aee41-76ef-4c53-a21e-edfb00063688">

Create an account 
<img width="796" alt="MicrosoftTeams-image (2)" src="https://github.com/kumara-tlc/Auth/assets/139904424/e3b632d2-3e30-46b3-ad28-b2cfcd8ed22a">

Open mail and verify the MangoDB Atlas

Sign in using email and password.
<img width="385" alt="MicrosoftTeams-image (4)" src="https://github.com/kumara-tlc/Auth/assets/139904424/fe4ddc05-2427-4979-8520-9c59a3f006eb">

Click remind me later

Click the Create button and click the free option then click the Create button

Create a user and click finish & close the button 

Click overview then click the connect button 
<img width="1384" alt="MicrosoftTeams-image (1)" src="https://github.com/kumara-tlc/Auth/assets/139904424/60a67fd2-b189-4120-9667-716a0f608275">

Click the drivers option
<img width="796" alt="MicrosoftTeams-image (6)" src="https://github.com/kumara-tlc/Auth/assets/139904424/83b4cf05-5370-4091-badd-e426089898d5">

That drivers page in the third point copies that URL
<img width="784" alt="MicrosoftTeams-image (3)" src="https://github.com/kumara-tlc/Auth/assets/139904424/f526e5a9-bb87-4ed7-aef4-f7f0ab01e79d">

Open the Visual Studio application then open the Auth file

Create a new file in the Auth file  in the outside package

The new file name is .env
<img width="300" alt="MicrosoftTeams-image (7)" src="https://github.com/kumara-tlc/Auth/assets/139904424/0a982d81-6a72-4bb7-ad8e-9858211b1afd">

Inside the .env file create a Const variable for store the copied URL (ex: DATABASE_CONNECTION_STRING = <paste the Atlas ULR>) 
<img width="1503" alt="MicrosoftTeams-image (5)" src="https://github.com/kumara-tlc/Auth/assets/139904424/15c85ba8-a6fb-4d13-b60a-6584b4538d00">

Paste the URL and remove the password and enter your user password.
       Example: DATABASE_CONNECTION_STRING = "mongodb+srv://xxxxxx:xxxx%40xx@cluster0.q3xw2fq.mongodb.net/?retryWrites=true&w=majority".
       
Use the URL Encode Web side to encode your symbols = https://www.urlencoder.org 
<img width="983" alt="MicrosoftTeams-image (10)" src="https://github.com/kumara-tlc/Auth/assets/139904424/cbd528ae-ec53-4e5f-a81d-d7af2e238624">
       Password:     xxxx@xx - xxxx%40xx
                     xxxxxx - xxxxxx
