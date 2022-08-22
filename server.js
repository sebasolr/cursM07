const express = require('express');
const fn = require('./db/funciones.js')
const funCom = require('./funcionesCompl.js')

const app = express()

app.use(express.static('public')) // para manejo de archivos estáticos
//app.use(express.urlencoded()) // para recibir datos de formulario POST
app.use(express.urlencoded({ extended: true }));

app.post('/usuario', async (req, res) => {
  const datos = await funCom.getForm(req)
  const nombre = datos.nombre
  const balance = datos.balance
  try {
    await fn.crearUsuario(nombre, balance)

  } catch (error) {
    res.statusCode = 400
    return res.json({ error: error })   
  }
  res.json({})
})
app.get('/usuarios', async (req, res) => {
  let usuarios
  try {
     usuarios = await fn.mostrarUsuarios()    
  } catch (error) {
    res.statusCode = 400
    return res.json({ error: error })
  }
  res.json(usuarios)
})
app.put('/usuario', async (req, res) => {
  const id = req.query.id
  const datos = await funCom.getForm(req)
  try {
    await fn.editarUsuarios(datos.name, datos.balance, id)
  } catch (error) {
    res.statusCode = 400
    return res.json({ error: error })
  }
  res.json({})
})
app.delete('/usuario', async (req, res) => {
  const id = req.query.id
  try {
    await fn.eliminarUsuario(id)    
  } catch (error) {
    res.statusCode = 400
    return res.json({ error: error })
  }
  //res.json({})
   res.redirect('/')
})
//__________________________________________________________________________-
app.post('/transferencia', async (req, res) => {
  const datos = await funCom.getForm(req)
  const date = new Date();
  try {
    await fn.crearTransferencias(datos.emisor, datos.receptor, datos.monto, funCom.formatDate(date))
  } catch (error) {
    res.statusCode = 400
    return res.json({ error: error })
  }
  res.json({})
})
app.get('/transferencias', async (req, res) => {
  const datos = await fn.historialtransferencias()
  res.json(datos)
})
app.get('*', (req, res) => {
  res.statusCode = 404
  res.send('Ruta no implementada')
})

app.listen(3000, () => {
  console.log(`Servidor en puerto http://localhost:3000/`);
});