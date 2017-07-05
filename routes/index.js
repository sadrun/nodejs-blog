/* GET home page. */
var crypto = require('crypto'), //生成散列值来加密密码
    User = require('../models/user'),
    fs = require('fs');

module.exports = function(app) {
    app.get(['/', '/index'], function(req, res) { //console.log(req.headers['user-agent']);
        if (isMobile(req)) {
            //res.render('mobile/index',{title:'MiniSky'});
            res.redirect('https://sadrun.github.io');
        } else {
            res.render('pc/index', { title: '主页' });
        }
    });

    app.get('/test/jsonp', function(req, res) {
        var _callback = req.query.callback;
        var _data = { blog: 'https://sadrun.github.io/', name: '牛海彬', email: '1264593211@qq.com' };
        if (_callback) {
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(_data) + ')');
        } else {
            res.json(_data);
        }
    });
    app.get('/test/json', function(req, res) {
        var _data = { blog: 'https://sadrun.github.io/', name: '牛海彬', email: '1264593211@qq.com' };
        res.json(_data);
    });


    app.get('/resume', function(req, res) {
        res.render('pc/resume', { title: 'resume' });
    });
    app.get('/resume/download', function(req, res) {
        res.download('./public/file/resume.doc');
    });
    app.post('/login', function(req, res) {});
    app.get('/post', function(req, res) {
        res.render('pc/post', { title: '发表' });
    });
    app.post('/post', function(req, res) {});
    app.get('/logout', function(req, res) {});
    app.get('/reg', function(req, res) {
        res.render('pc/reg', { title: '注册' });
    });
    app.post('/reg', function(req, res) {
        //console.log(req.session)
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];


        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        var user = new User();

        user.find(name, function(err, result) {
                if (err) {
                    console.log("查询出错");
                    return;
                }
                if (result.length == 0) {
                    console.log([name, password, req.body.email]);
                    user.save([name, password, req.body.email], function(err, result) {
                        if (err) {
                            console.log("保存出错");
                            return;
                        } else {
                            console.log(result);
                            //req.session.user = result;
                            return res.redirect('/');
                        }
                    });
                } else {
                    return res.redirect('/reg');
                }
            })
            //检查用户名是否已经存在

    });

    /*例子路由*/
    app.get('/skyexample/example', function(req, res) {
        res.render('pc/skyexample/example', { title: '特效例子' });
    });
    app.get('/skyexample/vkeyboard', function(req, res) {
        res.render('pc/skyexample/vkeyboard', { title: '虚拟键盘' });
    });
    app.get('/skyexample/upload', function(req, res) {
        res.render('pc/upload', {
            title: '文件上传'
        });
    });
    app.post('/upload', function(req, res) {
        var _file = '';
        for (var i in req.files) {
            _file = req.files[i];
            if (req.files[i].size == 0) {

                fs.unlinkSync(req.files[i].path);
                console.log('Successfully removed an empty file!');
            } else {
                var target_path = './public/images/test.png';
                // 使用同步方式重命名一个文件
                fs.renameSync(req.files[i].path, target_path);
                console.log('Successfully renamed a file!');
            }
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Content-Type", "application/json;charset=utf-8");
        res.send({ filename: _file.originalFilename, url: 'http://' + req.headers.host + '/images/test.png' });
    });
};


function isMobile(req) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if (agentID)
        return true;
    else
        return false;
}