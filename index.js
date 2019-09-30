const origenes = require('./data/origenes');
const destinos = require('./data/destinos');
const servicios = require('./data/servicios');

const admin = require('firebase-admin');
let serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mibus-a18ad.firebaseio.com"
});

let db = admin.firestore();

async function addOrigenes() {
  const origenRef = db.collection('origen');
  origenes.forEach(origen => {
    origenRef.doc(origen.codigo).set(origen);
  });
}

async function addDestinos() {
  const origenRef = db.collection('origen');
  destinos.forEach(destino => {
    const destinoRef = origenRef.doc(destino.destinoCodigo);
    destinoRef.get().then(origen => {
      origenRef
      .doc(destino.origen)
      .collection('destinos')
      .doc(destino.destinoCodigo)
      .set(origen.data())
      .catch(error => {
        console.error("Error adding document: ", error, origen);
      });
    });
  });
}

function addServicios() {
  const servicioRef = db.collection('servicio');
  servicios.forEach(servicio => {
    servicioRef.add(servicio);
  });
}

await addOrigenes();
await addDestinos();
addServicios();
