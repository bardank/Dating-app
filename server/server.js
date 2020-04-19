require('dotenv').config()
const express = require('express')
const app = express();
const connectDB = require('./configDB/dbconnect')

const socket =  require('socket.io');
const http = require('http');

const server = http.createServer(app);
const io = socket(server);
const Chat = require('./models/Chat');
const ChatRoom = require('./models/ChatRoom');
const Notification = require('./models/Notification');

const redis = require('socket.io-redis');
io.adapter(redis({ host: '127.0.0.1', port: 6379 }));
const emitter = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
connectDB();
const cors = require('cors');
app.use(cors());

const chatChangeStream = Chat.watch();
const notoficationChangeStream = Notification.watch();
const notify = emitter.of('/notification');

chatChangeStream.on('change', (change) => {
    change.fullDocument.users.map(user=>{
        
        
        let room = (user._id) ;
        
        notify.to(room).emit('newMessage', change.fullDocument);

    })
    
}); 

notoficationChangeStream.on('change', async(change) => {
    let notification;
    if(change){
        if(change.fullDocument.type === 'matched'){
            notification = await Notification.findById(change.fullDocument._id).populate('receiver',['name', 'avatar']);
        }
        if(change.fullDocument.type === 'rightSwiped'){
    
            notification = await Notification.findById(change.fullDocument._id).populate('createdBy',['name', 'avatar'])
        }
        change.fullDocument.receiver.map(room=>{
           
            return notify.to(String(room)).emit('newMatch', notification);
        })
    }
   
    
    
}); 


app.use(express.json({extended: false}));


const nsp2 = io.of('/notification');
nsp2.on(('connection'), (socket) => {
    socket.on('join', ({_id})=>{
        socket.join(_id)
       console.log('joined', _id)
    })

    socket.on('disconnect', ()=> null)
});


const nsp1 = io.of('/chat');
nsp1.on(('connection'), (socket) => {

    socket.on('join', async({chatRoom, user})=>{
        if(chatRoom){
            socket.join(chatRoom)
            let chatList = await ChatRoom.findById(chatRoom);
            if(String(chatList.sender) !== String(user)){
                chatList = await ChatRoom.findOneAndUpdate({_id: chatRoom}, 
                    {$set : { "status": true}},
                    {new :true}
                );
            }
        }else{
            return null
        }
    });

    socket.on('sendMessage', async({msg, senderID, receiverID, type, room}) => {
        try {
            const newMessage = await new Chat({
                message: msg,
                sender: senderID ,
                users: [senderID, receiverID ],
                room: room,
                type: type

            })
            const chat = await newMessage.save(); 
            const chatSend =  await chat.populate('sender', ["name", "avatar"]).execPopulate();
            const chatList = await ChatRoom.findOneAndUpdate({_id: room}, 
                {$set : {"message": msg, "sender": senderID, status: false}},
                {new :true}
            );
            
            nsp1.to(room).emit('message', chatSend )
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('disconnect', ()=>null)
});

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api', require('./routes/api/passReset'))
app.use('/api/verify', require('./routes/api/verifyEmail'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/match', require('./routes/api/match'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/chat', require('./routes/api/chat'))
app.use('/api/geolocation', require('./routes/api/geolocation'))
app.use('/api/notifications', require('./routes/api/notification'))
app.use('/api/report', require('./routes/api/report'))



const PORT = process.env.PORT || 5000
server.listen(PORT, ()=>{
    console.log(`server has started on port ${PORT}`)
})