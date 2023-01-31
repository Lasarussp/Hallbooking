const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();

const port = process.env.PORT;

const rooms = [ 
    { 
        room_name : 'Elite',
        room_id : 1,
        seats : 150,
        amenties : ['wifi,AC,TV'],
        price_per_hour : 1200,
    },
    {
        room_name : 'Premium',
        room_id : 2,
        seats : 200,
        amenties : ['wifi,projection screen,AC,TV'],
        price_per_hour : 2000,
    },
];

const bookingDetails = [
    {
        customerName : 'lasarus',
        room_name : 'Elite',
        booked_room_id : 1,
        date : new Date('2022-12-21'),
        start_time : '14:00',
        end_time : '16:00',
        status : 'booked',
    },
    {
        customerName : 'bob',
        room_name : 'premium',
        booked_room_id : 2,
        date : new Date('2022-12-20'),
        start_time : '14:00',
        end_time : '16:00',
        status : 'booked',
    },
    {
        customerName:"ram",
        booked_room_id:"3",
        room_name:"Elite",
        date:new Date ('2022-12-23'),
        start_time:"14:00",
        end_time:"16:00",
        status:"booked"
    },
];

// => Home page 

app.get('/',(req,res) => {
    res.status(200).json({
        message : 'Welcome to hall booking app 🙋🏻‍♀️✨',
        To_create_a_room : '/room/create',
        To_book_a_room : '/room/book',
        To_get_the_details_of_booked_rooms : '/room/booked-details',
        To_get_the_details_of_booked_customer : '/room/customer-details',
    });
});

// => creat a room 

app.post('/room/create', (req,res) => {
    const id = rooms.length +1;
    req.body.room_id = id;
    rooms.push ({
        room_name : req.body.room_name,
        room_id : req.body.room_id,
        seats : req.body.seats,
        amenties : req.body.amenties,
        price_per_hour : req.body.price_per_hour,
    });
    res.status(201).json(`The id ${id} with room is created successfully...!`)
});

// => booking a room 

app.post('/room/book', (req,res) => {
    const id = bookingDetails.length +1;
    req.body.booked_room_id = id;
    try {
        req.body.date = new Date(req.body.date);
        const bookingDetail = {
            customerName : req.body.customerName,
            booked_room_id : req.body.booked_room_id,
            room_name : req.body.room_name,
            date : req.body.date,
            start_time : req.body.start_time,
            end_time : req.body.end_time,
            status : 'booked',
        };
        const result = undefined;
        for (const book of bookingDetails) {
            if (
                book.date.getTime() == req.body.date.getTime() && 
                book.start_time == req.body.start_time
            ) {
                console.log(book.date.getTime(),req.body.date.getTime());
                result = 0;
                console.log('in booking');
                return res 
                .status(400)
                .send({ error : 'The room is not available with this time slot'});
            } else {
                result = 1;
                bookingDetails.push(bookingDetail);
                return res
                .status(201)
                .send(`Room is successsfully created with id ${req.body.booked_room_id}`);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('internal server error')
    }
});

// => list all rooms booked data 

app.get('/room/booked-details', (req,res) => {
    const roomArray = [];
    bookingDetails.forEach((customer) => {
        const roomObj = {};
        roomObj.room_name = customer.room_name;
        roomObj.status = customer.status;
        roomObj.customerName = customer.customerName;
        roomObj.date = customer.date;
        roomObj.start_time = customer.start_time;
        roomObj.end_time = customer.end_time;
        roomArray.push(roomObj);
    });
    res.status(200).send(roomArray);
});

// => list all rooms customer data

app.get('/room/customer-details', (req,res) => {
    const customerArray = [];
    bookingDetails.forEach((customer) => {
        const customerObj = {};
        customerObj.customerName = customer.customerName;
        customerObj.room_name = customer.room_name;
        customerObj.date = customer.date;
        customerObj.start_time = customer.start_time;
        customerObj.end_time = customer.end_time;
        customerArray.push(customerObj);
    });
    res.status(200).send(customerArray);
});

app.listen(port,() => {
    console.log(`App is running on the port ${port}`);
});
