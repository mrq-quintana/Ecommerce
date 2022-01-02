import admin from 'firebase-admin';
import config from '../config.js';

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL:"htpps://ecommerce-8868d.firebaseio.com"
})

const db = admin.firestore();

export default class ContenedorFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async getById(id) {
        try {
            const doc = await this.coleccion.doc(id).get();
            if (!doc.exists) {
                throw new Error(`Error al listar por id: no se encontró`)
            } else {
                const data = doc.data();
                return { ...data, id }
            }
        } catch (error) {
            throw new Error(`Error al listar por id: ${error}`)
        }
    }
}
