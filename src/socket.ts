import Logger from './utils/logging';
import { info } from 'console';
import { Server as HTTPServer } from 'http';
import { object } from 'joi';
import { Socket, Server } from 'socket.io';
import { callbackify } from 'util';
import { v4 } from 'uuid';

let val = JSON.stringify({
    SK: 'RRRST778',
    DID: '8876859487',
    V1: 205,
    V1_R: 'N',
    V2: 181,
    V2_R: 'N',
    V3: 186,
    V3_R: 'N',
    I1: 55,
    I1_R: 'N',
    I2: 78,
    I2_R: 'N',
    I3: 3,
    I3_R: 'N',
    PF1: 1.1205595136319317,
    PF_R: 'N',
    PF2: 1.6569708173880913,
    PF3: 1.2079522031413057,
    FREQ: 51.968457185081384,
    FREQ_R: 'N',
    MkWh: 293,
    MkWh_R: 'N',
    D0: 0,
    D0_R: 'N',
    D1: 1,
    D1_R: 'N',
    D2: 1,
    D2_R: 'N',
    D3: 1,
    D3_R: 'N',
    D4: 0,
    D4_R: 'N',
    D5: 0,
    D5_R: 'N',
    timestamp: 1663219902
});

export class ServerSocket {
    // static PrepareMessage(clientCode: string | null, device_id: string, tsData: string, message: object) {

    // }
    public static instance: ServerSocket;
    public static io: Server;
    public static clientSocket: string[] = [];
    public static deviceSockets: string[] = [];
    /** Master list of all connected users  */
    public users: { [uid: string]: string };
    /** Master list of arrays of all clients */
    public static clients: { [cid: string]: string };
    /** Master list of arrays of all devices */
    public static devices: { [did: string]: string };
    constructor(server: HTTPServer) {
        ServerSocket.instance = this;
        this.users = {};
        ServerSocket.clients = {};
        ServerSocket.devices = {};
      
        ServerSocket.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });
        ServerSocket.io.on('connect', this.StartListeners);

        console.info('Socket IO started');
    }

    StartListeners = (socket: Socket) => {
        console.info('Message received from ' + socket.id);

        socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
            console.info('Handshake received from ' + socket.id);

            /**Check if this is a reconnection */
            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.info('This user has reconnected.');
                const uid = this.GetUidFromSocketId(socket.id);
                const users = Object.values(this.users);

                if (uid) {
                    console.info('Sending callback for reconnect...');
                    callback(uid, users);
                    return;
                }
            }

            /** Generate new user*/
            const uid = v4();
            this.users[uid] = socket.id;
            const users = Object.values(this.users);
            console.info('Sending callback for handshake...');
            callback(uid, users);

            /** Send new user to all connected users */
            ServerSocket.SendMessage(
                'user_connected',
                users.filter((id) => id !== socket.id),
                users
            );
        });

        socket.on('disconnect', () => {
            console.info('Disconnect received from ' + socket.id);

            const uid = this.GetUidFromSocketId(socket.id);

            if (uid) {
                delete this.users[uid];
                const users = Object.values(this.users);
                ServerSocket.SendMessage('user_disconnected', users, uid);
            }
            const cid = this.GetCidFromSocketId(socket.id);
            if (cid) {
                delete ServerSocket.clients[cid];
                const clients = Object.values(ServerSocket.clients);
                //this.SendMessage('user_disconnected', users, uid);
                console.log(ServerSocket.clients);
            }
        });

        socket.on('add_client', (cid) => {
            console.log('Client to be added : ' + cid);
            this.AddToClientList(cid, socket.id);
        });

        socket.on('add_device', (did) => {
            console.log('Device to be added : ' + did);
            this.AddToDeviceList(did, socket.id);
        });

        socket.on('remove_device', () => {
            const did = this.GetDidFromSocketId(socket.id);
            if (did) {
                delete ServerSocket.devices[did];
                const devices = Object.values(ServerSocket.devices);
                //this.SendMessage('user_disconnected', users, uid);
                console.log(ServerSocket.devices);
            }
        });
    };

    GetUidFromSocketId = (id: string) => Object.keys(this.users).find((uid) => this.users[uid] === id);

    GetCidFromSocketId = (id: string) =>
        Object.keys(ServerSocket.clients).find((cid) => {
            ServerSocket.clients[cid] === id;
            console.log(ServerSocket.clients[cid]);
        });
    GetDidFromSocketId = (id: string) =>
        Object.keys(ServerSocket.devices).find((did) => {
            ServerSocket.devices[did] === id;
            console.log(ServerSocket.devices[did]);
        });
    static GetSocketIDsFromClientID = (cid: string) => {
        this.clientSocket = [];
        for (let key of Object.keys(this.clients)) {
            if (this.clients[key] === cid) {
                this.clientSocket.push(key);
            }
        }
        return this.clientSocket;
    };
    static GetSocketIDsFromDeviceID = (did: string) => {
        this.deviceSockets = [];
        Logger.info('socket', 'devices', this.devices);
        for (let key of Object.keys(this.devices)) {
            if (this.devices[key] === did) {
                this.deviceSockets.push(key);
            }
        }
        return this.deviceSockets;
    };

    AddToClientList = (id: string, sid: string) => {
        ServerSocket.clients[sid] = id;
        const clients = Object.values(ServerSocket.clients);

        console.log(ServerSocket.clients);
    };

    AddToDeviceList = (id: string, sid: string) => {
        ServerSocket.devices[sid] = id;
        const devices = Object.values(ServerSocket.devices);

        console.log(ServerSocket.devices);
    };

    /**
     * Prepare message to send through socket
     * @param client_Id ID of client to whom the device belongs
     * @param device_Id ID of device whose data is to be sent
     * @param dataTimeStamp TimeStamp when data was received
     * @param payload device meta data like lastUpdated or complete deviceData
     */
    static PrepareMessage = (client_Id: string, device_Id: string, dataTimestamp?: object, payload?: object) => {
        Logger.info('socket', 'client_Id', client_Id);
        const clientSockets = this.GetSocketIDsFromClientID(client_Id);
        Logger.info('socket', 'clientSockets', clientSockets);
        this.SendMessage('client_data', clientSockets, dataTimestamp);

        const deviceSockets = this.GetSocketIDsFromDeviceID(device_Id);
        Logger.info('socket', 'deviceSockets', deviceSockets);
        Logger.info('socket', 'payload', payload);
        this.SendMessage('device_data', deviceSockets, payload);
    };

    /**
     * Send a message through the socket
     * @param name The name of the event, ex: handshake
     * @param users List of Socket id's
     * @param payload any information needed by the user for state updates
     */
    static SendMessage = (name: string, users: string[], payload?: Object) => {
        console.info('Emmitting Events: ' + name + ' to ', users);
        users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
    };
}
