const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const md5 = require('md5');
const app = express();
const cors = require('cors');
const port = 3017;

const jwt = require('jsonwebtoken');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const execSQL = (sql) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'waleska'
    });

    connection.connect((error) => {
      if (error){
          res.json(error);
          return;
      }
  
      connection.query(sql, (error, results, fields) => {
          if(error) 
            reject(error);
          else
            resolve(results);
            connection.destroy();
      });    
    })
  });
}

const execSQLQuery = (sqlQry, res) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'waleska'
    });

    connection.connect((error) => {
      if (error){
          res.json(error);
          return;
      }
  
      connection.query(sqlQry, (error, results, fields) => {
          if(error) 
            res.json(error);
          else
            res.json(results);
          connection.end();
          console.log('executou!');
      });    
    })
}


app.get('/user', async(req, res) => {
  console.table(await execSQL('SELECT * FROM user'));
  execSQLQuery('SELECT * FROM user', res);
  console.log("Retornou todos os users!");
})


app.post('/user', (req, res) => {  
  const name = req.body.name;
  const cpf = req.body.cpf;
  const password = md5(req.body.password);

  execSQLQuery(`INSERT INTO user(name, cpf, password, status) VALUES('${name}', '${cpf}', '${password}', 1)`, res);
});


//===========

//authentication
app.post('/login', async (req, res) => {
  const name     = req.body.name;
  const password = md5(req.body.password);

  const sql    = `SELECT * FROM USER WHERE USER.NAME = '${name}' AND PASSWORD = '${password}' AND STATUS = 1 `
  const result =  await execSQL(sql);

  if (result == undefined || result.length == 0){
    res.status(500).json({message: 'Login inválido!'});
    return;
  }

  const id = result[0].iduser;
    const token = jwt.sign({ id }, '1234', {
        expiresIn: 300 // expires in 5min
    });
    return res.json({ auth: true, token: token });    

})

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}


app.listen(port, () => {
  console.log(`Example app listening on port${port}`)
}) 




/*
app.post('/cadastro', (req, res) => {  
  const nome = req.body.nome;
  const telefone = req.body.telefone;

  execSQLQuery(`INSERT INTO cadastro(nome, telefone) VALUES('${nome}','${telefone}')`, res);
});

app.get('/cadastro', async(req, res) => {
  console.table(await execSQL('SELECT * FROM cadastro'));
  execSQLQuery('SELECT * FROM cadastro', res);
  console.log("Retornou todos os users!");
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) */