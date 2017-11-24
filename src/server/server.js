'use strict';

const http = require('http'),
      fs = require('fs'),
      ejs = require('ejs'),
      url = require('url'),
      qs =  require('querystring'),
      PORT = 8124;

const template = fs.readFileSync('../template/index.ejs', 'UTF-8'),
      // templateContent = fs.readFileSync('../template/content.ejs', 'UTF-8'),
      page1 = fs.readFileSync('../template/page1.ejs', 'UTF-8'),
      page2 = fs.readFileSync('../template/page2.ejs', 'UTF-8'),
      page3 = fs.readFileSync('../template/page3.ejs', 'UTF-8');

const routes = {
  '/': {
    'title': 'Main Page',
    'message': 'Page1を表示しています。',
    'content': page1
  },
  '/index': {
    'title': 'Main Page',
    'message': 'Page1を表示しています。',
    'content': page1
  },
  '/page2': {
    'title': 'Page2',
    'message': 'Page2を表示しています。',
    'content': page2
  },
  '/post': {
    'title': 'Post Page',
    'content': page3
  }
};

const server = http.createServer();

// const doRequest = (req, res) => {
//   const number = Math.floor(Math.random() * 3);
//   fs.readFile('../../index.html', 'UTF-8',
//     function(err, data) {
//       let title = ['サンプルページA', 'サンプルページB', 'サンプルページC'],
//           content = [
//                       'サンプルページA コンテンツ',
//                       'サンプルページB コンテンツ',
//                       'サンプルページC コンテンツ'
//                     ],
//           data2 = data.replace(/@title@/g, title[number]).replace(/@content@/g, content[number]);

//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data2);
//       res.end();
//     }
//   );
// };

const doRequest = (req, res) => {

  // const templateSub = ejs.render(template, {
  //   title: 'テンプレート タイトル',
  //   content: ejs.render(templateContent, {
  //     data: [
  //       'リスト1：コンテンツ',
  //       'リスト2：コンテンツ',
  //       'リスト3：コンテンツ'
  //     ]
  //   })
  // });

  const urlParts = url.parse(req.url);
  // route check
  if(routes[urlParts.pathname] == null) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!DOCTYPE html><html lang="ja"><html><head></head><body><h1>NOT FOUND PAGE:' + req.url + '</h1></body></html>');
    return;
  }

  // page render
  // const page = ejs.render(template, {
  //   title: routes[urlParts.pathname].title,
  //   content: ejs.render(
  //     routes[urlParts.pathname].content,
  //     {
  //       message: routes[urlParts.pathname].message
  //     }
  //   )
  // });

  // res.writeHead(200, {'Content-Type': 'text/html'});
  // res.write(page);
  // res.end();

  // get
  if(req.method == 'GET') {
    const content = ejs.render(template, {
      title: routes[urlParts.pathname].title,
      content: ejs.render(
        routes[urlParts.pathname].content,
        {
          message: routes[urlParts.pathname].message
        }
      )
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(content);
    res.end();
    return;
  }
  // post
  if(req.method == 'POST') {
    if (urlParts.pathname == '/post'){
      let body = '';
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', () => {
        const post = qs.parse(body);
        const content = ejs.render(template, {
          title: routes[urlParts.pathname].title,
          content: ejs.render(
            routes[urlParts.pathname].content,
            {
              id: post.id,
              pw: post.pw
            }
          )
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(content);
        res.end();
      });
    } else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('No Post!');
      res.end();
    }
  }
};

server.on('request', doRequest);
server.listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
