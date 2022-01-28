const mongoose = require('mongoose')

// import getConfig from "next/config";
// const { publicRuntimeConfig } = getConfig() || null;

const connection = {};

async function connect() {
    if (connection.isConnected) {
        console.log('already connected')
        return "  DB connected ";
    }

    if (mongoose.connections.length > 1) {
        connect.isConnected = mongoose.connections[0].isReadyState;
        if (connection.isConnected === 1) {
            console.log(' \r\n DB connection: Please Use Previous connection \r\n')
            return;
        }
        await mongoose.disconnect()
    }


    try {
        // const db = await mongoose.connect(process.env.DATABASE_CONNECTION || publicRuntimeConfig.DATABASE_CONNECTION  , {
        const db = await mongoose.connect(process.env.DATABASE_CONNECTION, {
        // const db = await mongoose.connect(publicRuntimeConfig.DATABASE_CONNECTION, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        connection.isConnected = db.connections[0].isReadyState;
        console.log("\r\n + YES: DB mongoose connect \r\n")
        return "  DB connected ";
    } catch (err) {
        (err) => { console.log(' \r\n- NO: DB mongoose.connect:::error: \r\n', err) }
        return "   xxxxxx DB NOT connected ";
    }

}


async function disconnect() {
    console.log(' \r\n enter disconnect: \r\n')
    if (connection.isConnected) {
        // if (process.process.env.NEXT_PUBLIC_NODE_ENV === 'dev') {
        // // if (publicRuntimeConfig.NEXT_PUBLIC_NODE_ENV === 'dev') {
        //     console.log(' \r\n db many connections - not disconnect - on dev mode \r\n ')
        // }
        // else {
            await mongoose.disconnect();
            connection.isConnected = false;
            console.log('mongoose.disconnect:')
        // }
    } else {
        console.log(' \r\n db-disconnect: you are not connected  \r\n')
    }

}


function getCocStringifyArr(arr) {
    return arr.map((d) => { return cocStringify(d) })
}

function cocStringify(doc) {

    if (Array.isArray(doc)) {
        return getCocStringifyArr(doc)
    }

    // if (doc._id) {
    doc._id = doc._id.toString();
    // }
    if (doc.inStack) {
        doc.inStack.map((s) => (
            s._id = s._id.toString()
        ))
    }


    if (doc.createdAt) {
        doc.createdAt = doc.createdAt.toString();
        doc.updatedAt = doc.updatedAt.toString();
    }
    return doc;
}



const db = { connect, disconnect, cocStringify };
export default db;

