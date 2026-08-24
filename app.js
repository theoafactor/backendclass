const express = require("express");
require('dotenv').config()

const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

const url = process.env.DB_CONNECT;

const mongo_client = new MongoClient(url);


const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "9de034f814c4a4",
    pass: "5d37671adfc798",
  },
});



// create a simple server
const server = express();

server.use(express.json());

// create the routes 
server.get("/search", (request, response) => {

    response.status(200).send({
        message: "You are on the about route",
        data: {
            username: "James",
            id: 123
        }
    })
})

 
server.post("/login", async (request, response) => {

  

    let fullname = request.body.fullname;
    let username = request.body.username;
    let password = request.body.password;

    await mongo_client.connect();
    
    let result = await mongo_client.db("backend-db").collection("users").insertOne({
        fullname: fullname, 
        username: username,
        password: password
    });

    console.log(result)


    response.status(200).send({
        message: "User logged in",
        data: {
            fullname: fullname
        }
    })

})


server.get("/verify", async(request, response) => {

    let user_email_to_verify = request.query.email;

    // check this email
    await mongo_client.connect();

    const find_user = await mongo_client.db("backend-db").collection("users").findOne({ email: user_email_to_verify });

    console.log(find_user);

    


});


server.post("/register", async (request, response) => {

    let firstname = request.body.firstname;
    let lastname = request.body.lastname;
    let email = request.body.email;
    let password = request.body.password;

    if(firstname.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0){


        const user = {
            firstname, 
            lastname,
            email,
            password,
            is_email_verified: false
        }

        //1.  check that the user exists already..

        //2. register the user 
        await mongo_client.connect();

        const register_feedback = await mongo_client.db("backend-db").collection("users").insertOne(user);
        if(register_feedback){


            const verification_link = `http://localhost:3000/verify?email=${email}`

             //3.  send a verification email to the user 
             const info = await transporter.sendMail({
                        from: '"Backend Team" <team@example.com>', // sender address
                        to: email, // list of recipients
                        subject: "Please Verify Your Account", // subject line
                        text: "Verify your account", // plain text body
                        html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email Address</title>
  <style type="text/css">
    /* RESET STYLES */
    body, table, td, p, a, div, span {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }
    body {
      background-color: #f6f9fc;
      padding: 20px 0;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    /* OUTER CONTAINER */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    /* HEADER */
    .header {
      background-color: #4f46e5;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
    }
    /* BODY */
    .body-content {
      padding: 40px 32px 32px;
    }
    .body-content p {
      color: #1a202c;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .body-content .greeting {
      font-size: 18px;
      font-weight: 600;
    }
    /* VERIFICATION BUTTON */
    .btn-primary {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 50px;
      margin: 16px 0 24px;
      box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
      transition: background-color 0.2s ease;
      text-align: center;
    }
    .btn-primary:hover {
      background-color: #4338ca;
    }
    /* FALLBACK LINK (for plain text) */
    .fallback-link {
      word-break: break-all;
      color: #4f46e5;
      font-size: 14px;
      background-color: #f7fafc;
      padding: 12px 16px;
      border-radius: 6px;
      display: block;
      margin: 16px 0 24px;
      border: 1px solid #e2e8f0;
    }
    .fallback-link a {
      color: #4f46e5;
      text-decoration: none;
    }
    /* DIVIDER */
    .divider {
      border-top: 1px solid #e2e8f0;
      margin: 32px 0 24px;
    }
    /* FOOTER */
    .footer {
      padding: 0 32px 32px;
      text-align: center;
    }
    .footer p {
      color: #718096;
      font-size: 13px;
      margin-bottom: 6px;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
    /* MOBILE RESPONSIVE */
    @media screen and (max-width: 480px) {
      .body-content {
        padding: 28px 20px;
      }
      .btn-primary {
        display: block;
        padding: 16px 20px;
        font-size: 17px;
      }
      .header h1 {
        font-size: 20px;
      }
      .fallback-link {
        font-size: 13px;
      }
    }
  </style>
</head>
<body>

  <!-- EMAIL WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f6f9fc;">
    <tr>
      <td align="center" style="padding:20px 16px;">
        <!-- MAIN CONTAINER -->
        <table class="email-container" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:8px;">

          <!-- HEADER -->
          <tr>
            <td class="header" style="background-color:#4f46e5; padding:32px 24px; text-align:center;">
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td class="body-content" style="padding:40px 32px 16px;">
              <p class="greeting" style="font-size:18px; font-weight:600; color:#1a202c; margin-bottom:12px;">Hello ${firstname},</p>
              <p style="color:#1a202c; font-size:16px; margin-bottom:16px;">
                Thanks for signing up! Please confirm your email address by clicking the button below. This helps us keep your account secure.
              </p>

              <!-- BUTTON (primary CTA) -->
              <div style="text-align:center;">
                <a href="${verification_link}" class="btn-primary" style="display:inline-block; background-color:#4f46e5; color:#ffffff !important; font-size:18px; font-weight:600; text-decoration:none; padding:14px 40px; border-radius:50px; margin:16px 0 24px; box-shadow:0 4px 6px rgba(79,70,229,0.2); text-align:center;">
                  ✓ Verify Email
                </a>
              </div>

              <!-- FALLBACK LINK (if button doesn't render) -->
              <p style="color:#4a5568; font-size:14px; margin:8px 0 4px;">
                Or copy and paste this link into your browser:
              </p>
              <div class="fallback-link" style="word-break:break-all; color:#4f46e5; font-size:14px; background-color:#f7fafc; padding:12px 16px; border-radius:6px; margin:8px 0 24px; border:1px solid #e2e8f0;">
                <a href="${verification_link}" style="color:#4f46e5; text-decoration:none;">{{VERIFICATION_LINK}}</a>
              </div>

              <!-- EXPIRY NOTE -->
              <p style="color:#718096; font-size:14px; margin-top:8px;">
                ⏱️ This link expires in <strong>24 hours</strong> for your security.
              </p>

              <!-- DIVIDER -->
              <div class="divider" style="border-top:1px solid #e2e8f0; margin:32px 0 20px;"></div>

              <!-- SUPPORT TEXT -->
              <p style="color:#4a5568; font-size:14px; margin-bottom:4px;">
                Didn’t request this? You can safely ignore this email.
              </p>
              <p style="color:#4a5568; font-size:14px;">
                Need help? <a href="mailto:support@yourdomain.com" style="color:#4f46e5; text-decoration:none;">support@yourdomain.com</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer" style="padding:0 32px 32px; text-align:center;">
              <p style="color:#718096; font-size:13px; margin-bottom:4px;">
                &copy; 2026 Your Company Name. All rights reserved.
              </p>
              <p style="color:#a0aec0; font-size:12px;">
                123 Main Street, City, Country
              </p>
            </td>
          </tr>

        </table>
        <!-- END MAIN CONTAINER -->
      </td>
    </tr>
  </table>

</body>
</html>
                                `, 
                    });


            response.status(201).send({
                message: "User account registered successfully!",
                code: "success",
                data: register_feedback
            })


        }else{

             response.status(500).send({
                message: "User could not be registered",
                code: "error",
                data: null
            })


        }


       


    }

    


})


// make the server listen for request
server.listen(process.env.PORT, () => console.log(`Server is listening on http://${process.env.HOSTNAME}:${process.env.PORT}`))