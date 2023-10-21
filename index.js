import fs from 'fs';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import express from 'express';
// Craete Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.sendFile(__dirname + './public/index.html')
})

// Add New BLog
app.post('/add-new-blog',(req,res) => {
    const data = req.body;
    addNewBlog(data['blog-title'],data['blog-code'])
    res.status(201).redirect('/admin/editBlog')
})

app.get('/blogs/:blogId',(req,res) => {
    const id = req.params['blogId'];
    
    // Get Data
    let jsonBlogsFile = JSON.parse(fs.readFileSync('./public/blogs.json','utf-8'));

    let blog = jsonBlogsFile.filter(blog=> blog['blog-id'] == id)[0]

    if (blog != undefined) {
        // Send The HTML
        const htmlCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="../../main.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <title>${blog['blog-title']}</title>
        </head>
        <body dir="rtl" class='blog-page'>
        <!-- Create Header -->
        <header>
          <a href="/index.html" class="logo">
            <img src="../../imgs/main_logo.png" alt="main_logo">
          </a>
          <nav>
            <ul class="links">
              <li>
                <a href="../../index.html">الصفحة الرئيسية</a>
              </li>
              <li>
                <a href="../../about/index.html">من نحن</a>
              </li>
              <li>
                <a href="../../blogs/index.html">ما الجديد؟</a>
              </li>
              <li>
                <a href="../../contact/index.html">تواصل معنا</a>
              </li>
            </ul>
          </nav>
        </header>
        <!-- End Header -->
            <section class="blog">
                <h1 class="blog-title">${blog['blog-title']}</h1>
                <div class="code">
                    ${blog['blog-code']}
                </div>
            </section>
            <!-- Start Footer -->
            <footer>
              <img src="../../imgs/full_logo.png" alt="b.tech school logo">
              <div class="d-flex">
                <ul class="social-links">
                  <li>
                    <a target="_blank" href="https://www.facebook.com/Btech.ATSchool">
                      <i class="fa-brands fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="https://eg.linkedin.com/company/b-tech-applied-technology-school">
                      <i class="fa-brands fa-linkedin-in"></i>
                    </a>
                  </li>
                </ul>
                <p class="copy">
                  &copy; <span class="date"></span> - مدرسة بي تك | جميع الحقوق
                    محفوظة
                </p>
              </div>
            </footer>
            <!-- End Footer -->
            <script>
            (function (w, d, s, o, f, js, fjs) {
              w["botsonic_widget"] = o;
              w[o] =
                w[o] ||
                function () {
                  (w[o].q = w[o].q || []).push(arguments);
                };
              (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
              js.id = o;
              js.src = f;
              js.async = 1;
              fjs.parentNode.insertBefore(js, fjs);
            })(window, document, "script", "Botsonic", "https://widget.writesonic.com/CDN/botsonic.min.js");
            Botsonic("init", {
              serviceBaseUrl: "https://api.botsonic.ai",
              token: "b605f63e-751c-4bcd-a1eb-a669157ce824",
            });
          </script>
        </body>
        </html>
        `
        res.send(htmlCode)
    } else {
        res.status(404).send('This Blog Not Found')
    }


})

// Listen The App On The Port
app.listen('3000',(req,res) => {
    console.log('Listened ON 3000 Port')
})





// Function

// Add New Blog Function
function addNewBlog(title,code) {
        // Write On Blogs Json File The New Blog
        let jsonBlogsFile = JSON.parse(fs.readFileSync('./public/blogs.json','utf-8'));

        // Get ID
        let id = 1;
        if (jsonBlogsFile.length !== 0) {
            jsonBlogsFile.map(blog => {
                console.log(blog['blog-id']);
                if (blog['blog-id'] >= id) {
                    id = blog['blog-id'] + 1;
                }
            })
        }
    
    
        jsonBlogsFile.push(
        {
            "blog-id":id,
            "blog-title":title,
            "blog-code":code
        });
        fs.writeFileSync('./public/blogs.json',JSON.stringify(jsonBlogsFile));
}


app.post('/admin/editBlog/uptade',(req,res) => {
    const data = req.body
    editBlog(data['blog-id'],data['new-blog-title'],data['new-blog-code']);
    res.status(202).redirect('/admin/editBlog');
})

app.post('/admin/editBlog/delete',(req,res) => {
    deleteBlog(req.body['blog-id']);
    res.status(202).redirect('/admin/editBlog');
})





// Delete Blog Function
function deleteBlog(id) {
    let jsonBlogsFile = JSON.parse(fs.readFileSync('./public/blogs.json','utf-8'));

    let filteredFile =  jsonBlogsFile.filter(blog=>{
        return blog['blog-id'] != id;
    } )
    console.log(filteredFile);
    fs.writeFileSync('./public/blogs.json',JSON.stringify(filteredFile));
}


// Edit Blog Function
function editBlog(id, newTitle,newCode) {
    // Get File
    let jsonBlogsFile = JSON.parse(fs.readFileSync('./public/blogs.json','utf-8'));
    // Remove The Edited Post
    let filteredBlogs = jsonBlogsFile.filter(blog => {
        return blog['blog-id'] != id
    });
    // Push The Update One With Id To The Array
    filteredBlogs.push({"blog-id":Number(id),"blog-title":newTitle,"blog-code":newCode});
    // Write Back Into the file
    fs.writeFile("./public/blogs.json", JSON.stringify(filteredBlogs), function() {})
}


// Send Email


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anasramadanking@gmail.com',
        pass: 'szrb kmkc tgyp whyp',
    },
});


app.post('/send-email',(req,res) => {

    const email = 'anasramadanking@gmail.com'

    const formData = req.body
    const mailOptions = {
        from: `${formData.name} <${formData.email}>`,
        to: email,
        subject: 'Email From B.TECH Website',
        html: `<!DOCTYPE html>
        <html>
        <head>
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            body {
              color: #333;
              direction:ltr;
            }
            * {
              font-family: 'Bebas Neue', sans-serif;
              text-align:left;
            }
            h1 {
              color: #edac66;
              font-size: 24px;
              margin-bottom: 10px;
            }
        
            h3 {
              font-size: 18px;
              margin-top: 20px;
            }
        
            p {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 10px;
            }
        
            span {
              font-weight: bold;
            }
        
            a {
              color: #007bff;
              text-decoration: none;
            }
        
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
        
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
        
            .details {
              margin-top: 30px;
            }
        
            .location {
              margin-top: 20px;
            }
        
            .contact {
              margin-top: 30px;
            }
        
            .contact p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body dir="rtl">
          <div class="container">
            <div class="header">
              <h1>From ${formData.name}</h1>
              <p>${formData.email}</p>
            </div>
            <div class="message">
            <h1>Message:</h1>
              <p>${formData.msg}</p>
            </div>
          </div>
        </body>
        </html>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        }
      });

      res.redirect('/contact')
})